import { render, screen } from '../../test-utils';
import { Input } from '../../../components/ui/Input';

describe('Input component', () => {
  test('renders an input element', () => {
    render(<Input placeholder="Test placeholder" />);
    const inputElement = screen.getByPlaceholderText('Test placeholder');
    expect(inputElement).toBeTruthy();
  });

  test('applies custom className', () => {
    render(<Input className="custom-class" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement.className).toContain('custom-class');
  });
}); 