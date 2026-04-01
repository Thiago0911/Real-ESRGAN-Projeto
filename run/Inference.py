import os
import cv2
import sys
import tqdm
import torch
import argparse

import numpy as np

from PIL import Image

def emit_progress(p):
    # imprime "37%" e força flush (essencial pro Node captar em tempo real)
    p = max(0, min(100, float(p)))
    print(f"PROGRESS:{p:.0f}", flush=True)
    
def emit_status(msg):
    print(f"STATUS:{msg}", flush=True)

filepath = os.path.split(os.path.abspath(__file__))[0]
repopath = os.path.split(filepath)[0]
sys.path.append(repopath)

from lib import *
from utils.misc import *
from data.dataloader import *
from data.custom_transforms import *

torch.backends.cuda.matmul.allow_tf32 = False
torch.backends.cudnn.allow_tf32 = False

def _args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', '-c',     type=str,            default='configs/InSPyReNet_SwinB.yaml')
    parser.add_argument('--source', '-s',     type=str)
    parser.add_argument('--dest', '-d',       type=str,            default=None)
    parser.add_argument('--type', '-t',       type=str,            default='map')
    parser.add_argument('--gpu', '-g',        action='store_true', default=False)
    parser.add_argument('--jit', '-j',        action='store_true', default=False)
    parser.add_argument('--verbose', '-v',    action='store_true', default=False)
    return parser.parse_args()

def get_format(source):
    img_ext = ('.jpg', '.png', '.jpeg')
    vid_ext = ('.mp4', '.avi', '.mov')

    img_count = 0
    vid_count = 0

    for i in source:
        ext = os.path.splitext(i)[1].lower().strip()

        if ext in img_ext:
            img_count += 1
        elif ext in vid_ext:
            vid_count += 1

    if img_count > 0 and vid_count > 0:
        return ''
    elif img_count > 0:
        return 'Image'
    elif vid_count > 0:
        return 'Video'
    else:
        return ''

def inference(opt, args):
    model = eval(opt.Model.name)(**opt.Model)
    model.load_state_dict(torch.load(os.path.join(
        opt.Test.Checkpoint.checkpoint_dir, 'latest.pth'), map_location=torch.device('cpu')), strict=True)

    if args.gpu is True:
        model = model.cuda()
    model.eval()
    emit_progress(10) # Progresso inicial

    # --- INÍCIO DA LÓGICA CORRIGIDA ---
    save_dir = None
    _format = None # Inicializa _format como None

    # 1. Determinar o formato e o diretório de salvamento
    if args.source.isnumeric() is True:
        _format = 'Webcam'
    elif os.path.isdir(args.source):
        save_dir = os.path.join('results', args.source.split(os.sep)[-1])
        _format = get_format(os.listdir(args.source))
    elif os.path.isfile(args.source):
        save_dir = 'results'
        _format = get_format([args.source])

    if args.dest is not None:
        save_dir = args.dest

    if save_dir is not None:
        os.makedirs(save_dir, exist_ok=True)

    # Fallback se o formato não for detectado
    if not _format:
        print("[ERRO] Formato não detectado, forçando Image")
        _format = "Image"

    print("DEBUG source:", args.source)
    print("DEBUG format:", _format)

    # 2. Agora que _format está definido, podemos inicializar sample_list
    if _format == "Image":
        sample_list = ImageLoader(args.source, opt.Test.Dataset.transforms)
    elif _format == "Video":
        sample_list = VideoLoader(args.source, opt.Test.Dataset.transforms)
    elif _format == "Webcam": # Adicione este caso se você tiver um WebcamLoader
        # Exemplo: sample_list = WebcamLoader(args.source, opt.Test.Dataset.transforms)
        raise NotImplementedError("WebcamLoader não implementado neste exemplo.")
    else:
        raise Exception(f"Formato inválido: {_format}")

    try:
        total = len(sample_list)
    except Exception:
        total = None

    emit_progress(15) # Progresso após carregar a lista de amostras
    # --- FIM DA LÓGICA CORRIGIDA ---

    # Lógica JIT (mantida no lugar original, pois depende do modelo já carregado)
    if args.jit is True:
        if os.path.isfile(os.path.join(opt.Test.Checkpoint.checkpoint_dir, 'jit.pt')) is False:
            model = Simplify(model)
            model = torch.jit.trace(model, torch.rand(1, 3, *opt.Test.Dataset.transforms.static_resize.size).cuda(), strict=False)
            torch.jit.save(model, os.path.join(opt.Test.Checkpoint.checkpoint_dir, 'jit.pt'))
        else:
            del model
            model = torch.jit.load(os.path.join(opt.Test.Checkpoint.checkpoint_dir, 'jit.pt'))

    # Inicialização de samples para o loop
    if args.verbose is True:
        samples = tqdm.tqdm(sample_list, desc='Inference', total=len(
            sample_list), position=0, leave=False, bar_format='{desc:<30}{percentage:3.0f}%|{bar:50}{r_bar}')
    else:
        samples = sample_list

    writer = None
    background = None

    # Loop de processamento (mantido como você o reorganizou para o progresso)
    for idx, sample in enumerate(samples):
        # Progresso por item (Image fica ótimo; Video/Webcam é aproximado)
        if total:
            emit_progress(15 + (idx / max(total, 1)) * 80)  # 15..95
        else:
            emit_progress(30)

        if _format == 'Video' and writer is None:
            writer = cv2.VideoWriter(
                os.path.join(save_dir, sample['name'] + '.mp4'),
                cv2.VideoWriter_fourcc(*'mp4v'),
                sample_list.fps,
                sample['shape'][::-1]
            )
            samples.total += int(sample_list.cap.get(cv2.CAP_PROP_FRAME_COUNT))

        if _format == 'Video' and sample['image'] is None:
            if writer is not None:
                writer.release()
            writer = None
            continue

        if args.gpu is True:
            sample = to_cuda(sample)

        with torch.no_grad():
            if args.jit is True:
                out = model(sample['image'])
            else:
                out = model(sample)

        pred = to_numpy(out['pred'], sample['shape'])
        img = np.array(sample['original'])

        if args.type == 'map':
            img = (np.stack([pred] * 3, axis=-1) * 255).astype(np.uint8)

        elif args.type == 'rgba':
            r, g, b = cv2.split(img)
            pred = (pred * 255).astype(np.uint8)
            img = cv2.merge([r, g, b, pred])

        elif args.type == 'green':
            bg = np.stack([np.ones_like(pred)] * 3, axis=-1) * [120, 255, 155]
            img = img * pred[..., np.newaxis] + bg * (1 - pred[..., np.newaxis])

        elif args.type == 'blur':
            img = img * pred[..., np.newaxis] + cv2.GaussianBlur(img, (0, 0), 15) * (1 - pred[..., np.newaxis])

        elif args.type == 'overlay':
            bg = (np.stack([np.ones_like(pred)] * 3, axis=-1) * [120, 255, 155] + img) // 2
            img = bg * pred[..., np.newaxis] + img * (1 - pred[..., np.newaxis])
            border = cv2.Canny(((pred > .5) * 255).astype(np.uint8), 50, 100)
            img[border != 0] = [120, 255, 155]

        elif args.type.lower().endswith(('.jpg', '.jpeg', '.png')):
            if background is None:
                background = cv2.cvtColor(cv2.imread(args.type), cv2.COLOR_BGR2RGB)
                background = cv2.resize(background, img.shape[:2][::-1])
            img = img * pred[..., np.newaxis] + background * (1 - pred[..., np.newaxis])

        elif args.type == 'debug':
            debs = []
            for k in opt.Train.Debug.keys:
                debs.extend(out[k])
            for i, j in enumerate(debs):
                log = torch.sigmoid(j).cpu().detach().numpy().squeeze()
                log = ((log - log.min()) / (log.max() - log.min()) * 255).astype(np.uint8)
                log = cv2.cvtColor(log, cv2.COLOR_GRAY2RGB)
                log = cv2.resize(log, img.shape[:2][::-1])
                Image.fromarray(log).save(os.path.join(save_dir, sample['name'] + '_' + str(i) + '.png'))

        img = img.astype(np.uint8)

        if _format == 'Image':
            Image.fromarray(img).save(os.path.join(save_dir, sample['name'] + '.png'))

            # item concluído (agora sim faz sentido usar idx+1)
            if total:
                emit_progress(15 + ((idx + 1) / max(total, 1)) * 85)  # 15..100
            else:
                emit_progress(100)

        elif _format == 'Video' and writer is not None:
            writer.write(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

        elif _format == 'Webcam':
            cv2.imshow('InSPyReNet', img)

    # fim do processamento
    emit_progress(100)

if __name__ == "__main__":
    args = _args()
    opt = load_config(args.config)
    inference(opt, args)