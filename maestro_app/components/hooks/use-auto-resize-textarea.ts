import { useRef, useCallback, useEffect } from 'react';

interface UseAutoResizeTextareaOptions {
  minHeight?: number;
  maxHeight?: number;
}

export function useAutoResizeTextarea({ 
  minHeight = 48, 
  maxHeight = 164 
}: UseAutoResizeTextareaOptions = {}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback((reset = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 如果需要重置高度
    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    // 设置高度为auto以便能够计算scrollHeight
    textarea.style.height = 'auto';
    
    // 计算实际内容高度
    const scrollHeight = textarea.scrollHeight;
    
    // 设置新高度，确保在min和max之间
    const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  // 初始化时调整高度
  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
} 