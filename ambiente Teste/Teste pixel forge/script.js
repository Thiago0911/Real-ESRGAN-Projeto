/**
 * Pixel Forge - PMZ Peças e Pneus
 * Frontend Logic - Estilo Claid.ai
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos de Controle
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const statusBadge = document.getElementById('status-badge');
    const btnOpenOutput = document.getElementById('btn-open-output');
    
    // Elementos de Upload
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const listInput = document.getElementById('list-input');
    const countInput = document.getElementById('count-input');
    
    // Elementos de Output/Tratadas
    const listOutput = document.getElementById('list-output');
    const countOutput = document.getElementById('count-output');
    const listTreated = document.getElementById('list-treated');
    const countTreated = document.getElementById('count-treated');

    // Elementos de Comparação
    const comparisonArea = document.getElementById('comparison-area');
    const selectedFilename = document.getElementById('selected-filename');
    const imgBefore = document.getElementById('img-before');
    const imgAfter = document.getElementById('img-after');
    const btnCloseComparison = document.getElementById('btn-close-comparison');

    // Estado do Sistema
    let systemState = 'waiting'; // waiting, processing, paused, finished

    /**
     * Atualiza o estado visual e funcional do sistema
     */
    const updateSystemState = (newState) => {
        systemState = newState;
        statusBadge.className = 'badge';
        
        switch(newState) {
            case 'waiting':
                statusBadge.textContent = 'Aguardando';
                statusBadge.classList.add('badge-waiting');
                btnStart.disabled = false;
                btnPause.disabled = true;
                btnOpenOutput.disabled = false;
                break;
                
            case 'processing':
                statusBadge.textContent = 'Processando...';
                statusBadge.classList.add('badge-processing');
                btnStart.disabled = true;
                btnPause.disabled = false;
                btnOpenOutput.disabled = true; // Bloqueado durante processamento
                break;
                
            case 'paused':
                statusBadge.textContent = 'Pausado';
                statusBadge.classList.add('badge-paused');
                btnStart.disabled = false;
                btnPause.disabled = true;
                btnOpenOutput.disabled = false;
                break;
                
            case 'finished':
                statusBadge.textContent = 'Finalizado';
                statusBadge.classList.add('badge-finished');
                btnStart.disabled = false;
                btnPause.disabled = true;
                btnOpenOutput.disabled = false;
                break;
        }
    };

    // --- Eventos de Controle ---

    btnStart.addEventListener('click', () => {
        updateSystemState('processing');
        // Futura integração: fetch('/api/start')
    });

    btnPause.addEventListener('click', () => {
        updateSystemState('paused');
        // Futura integração: fetch('/api/pause')
    });

    btnOpenOutput.addEventListener('click', () => {
        console.log('Abrindo pasta de output...');
        fetch('/open-output-folder')
            .catch(err => console.error('Erro ao abrir pasta:', err));
    });

    // --- Lógica de Comparação ---

    const showComparison = (fileName) => {
        selectedFilename.textContent = fileName;
        
        // Em um ambiente real com Flask, os caminhos seriam servidos por rotas
        // Exemplo: /get-image/treated/nome.jpg e /get-image/output/nome.jpg
        imgBefore.src = `../tratadas/${fileName}`; 
        imgAfter.src = `../output/${fileName}`;
        
        comparisonArea.style.display = 'block';
        comparisonArea.scrollIntoView({ behavior: 'smooth' });
    };

    btnCloseComparison.addEventListener('click', () => {
        comparisonArea.style.display = 'none';
    });

    // --- Lógica de Upload e Listagem ---

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border)';
        handleFiles(e.dataTransfer.files);
    });

    const handleFiles = (files) => {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                addFileToList(file.name, listInput);
                
                // Simulação: Adicionando ao output para teste de comparação
                setTimeout(() => {
                    addFileToList(file.name, listOutput);
                    addFileToList(file.name, listTreated);
                    updateCounts();
                }, 1000);
            }
        });
        updateCounts();
    };

    const addFileToList = (name, listElement) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        
        if (listElement === listOutput) {
            // No Output, o nome é um botão para comparação
            li.innerHTML = `
                <button class="file-name-btn" title="Clique para comparar">${name}</button>
                <span class="status-dot"></span>
            `;
            li.querySelector('.file-name-btn').addEventListener('click', () => showComparison(name));
        } else {
            li.innerHTML = `<span class="file-name-static">${name}</span>`;
        }
        
        listElement.appendChild(li);
    };

    const updateCounts = () => {
        countInput.textContent = listInput.children.length;
        countOutput.textContent = listOutput.children.length;
        countTreated.textContent = listTreated.children.length;
    };

    // Inicialização
    updateSystemState('waiting');
    updateCounts();
});
