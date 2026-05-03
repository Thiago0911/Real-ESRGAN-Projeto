function useInView(ref: React.RefObject<any>, margin = "-100px") {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // roda só uma vez
        }
      },
      { rootMargin: margin }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return isVisible;
}