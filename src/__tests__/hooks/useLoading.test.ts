import { renderHook, act } from '@testing-library/react';
import { useLoading } from '../../hooks/useLoading';

describe('useLoading hook', () => {
  test('initial state is not loading', () => {
    const { result } = renderHook(() => useLoading());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.showLoading).toBe(false);
  });

  test('startLoading sets isLoading to true', () => {
    const { result } = renderHook(() => useLoading());
    
    act(() => {
      result.current.startLoading();
    });
    
    expect(result.current.isLoading).toBe(true);
  });

  test('stopLoading sets isLoading to false', () => {
    const { result } = renderHook(() => useLoading());
    
    act(() => {
      result.current.startLoading();
    });
    
    expect(result.current.isLoading).toBe(true);
    
    act(() => {
      result.current.stopLoading();
    });
    
    expect(result.current.isLoading).toBe(false);
  });
}); 