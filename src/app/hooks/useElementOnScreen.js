const { useRef, useState, useEffect } = require("react");

export default function useElementOnScreen(options) {
  const container = useRef(null);
  const [visible, setVisible] = useState(false);
  const callback = (entries) => {
    const [entry] = entries;
    setVisible(entry.isIntersecting);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if (container.current) observer.observe(container.current);
    return () => {
      if (container.current) observer.unobserve(container.current);
    };
  }, [container, options]);
  return [container, visible];
};
