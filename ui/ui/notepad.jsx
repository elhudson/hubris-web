import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default ({ text, onChange }) => {
  return <ReactQuill theme={null} value={text} onChange={onChange} />;
}