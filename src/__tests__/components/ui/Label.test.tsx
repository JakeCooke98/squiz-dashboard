import { render, screen } from '../../test-utils';
import { Label } from '../../../components/ui/Label';

describe('Label component', () => {
  test('renders with children', () => {
    render(<Label>Test Label</Label>);
    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toBeTruthy();
  });

  test('applies custom className', () => {
    render(<Label className="custom-class">Test Label</Label>);
    const labelElement = screen.getByText('Test Label');
    expect(labelElement.className).toContain('custom-class');
  });
}); 