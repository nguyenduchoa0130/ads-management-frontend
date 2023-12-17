import { SearchOutlined } from '@ant-design/icons';
import { useDebounceValue } from '@hooks/useDebounceValue';
import TableColumn from '@interfaces/table-column';
import { Input, Table } from 'antd';
import { FC, useMemo, useState } from 'react';

interface AdsTableProps {
  dataSrc: any[];
  rowKey: string;
  cols: TableColumn[];
  pageSize?: number;
  hasFilter?: boolean;
  searchByFields?: string[];
}

const AdsTable: FC<AdsTableProps> = ({
  cols = [],
  dataSrc = [],
  rowKey = null,
  pageSize = 10,
  hasFilter = false,
  searchByFields = [],
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounceValue(query, 300);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim() || !searchByFields.length || !hasFilter) {
      return dataSrc;
    }
    const regex = new RegExp(query.trim(), 'ig');
    const results = dataSrc.filter((item) => {
      return searchByFields.some((key) => {
        const value = item[key];
        return typeof value === 'string' && value.match(regex);
      });
    });
    return results;
  }, [debouncedQuery, dataSrc]);

  return (
    <>
      {hasFilter && (
        <Input
          placeholder={`Tìm kiếm`}
          prefix={<SearchOutlined />}
          onChange={handleQueryChange}
          size='large'
        />
      )}
      <div className='py-3'>
        <Table
          rowKey={rowKey}
          columns={cols as any}
          dataSource={filteredData}
          pagination={{ position: ['bottomRight'], pageSize, hideOnSinglePage: true }}
        />
      </div>
    </>
  );
};

export default AdsTable;
