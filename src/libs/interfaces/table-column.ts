export default interface TableColumn {
  title?: string;
  key: string;
  dataIndex: string;
  render?: Function;
  align?: 'left' | 'center' | 'right';
  
}
