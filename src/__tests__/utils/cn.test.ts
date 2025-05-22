import { cn } from '../../utils/cn';

describe('cn utility', () => {
  test('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  test('handles conditional classes correctly', () => {
    const isActive = true;
    const isDisabled = false;
    
    expect(cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled'
    )).toBe('base-class active');
  });

  test('filters out falsy values', () => {
    expect(cn('class1', false, null, undefined, 0, 'class2')).toBe('class1 class2');
  });
}); 