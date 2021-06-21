import Input from './Input';

export default interface Provider {
  id: string;
  name: string;
  url: string;
  input: Input;
  clickSelector: string;
}
