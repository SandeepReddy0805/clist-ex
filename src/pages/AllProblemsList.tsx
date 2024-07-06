import { Table, TableColumnsType, TablePaginationConfig, TableProps } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { loadProblemsList } from '../services';
import Problem from '../types/Problem';

interface ProblemRow{
    key: React.Key;
    id: string,
    sno: number,
    name: string,
    solved: number,
    rating: number,
}

function AllProblemsList(props:any) {
    const { resource } = props;
    const prevResourceRef = useRef<string>();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 100,
    });
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<ProblemRow[]>([]);
    
    const columns: TableColumnsType<ProblemRow> = [
        {
            title: '#',
            dataIndex: 'sno',
            key: 'sno',
            width: '10%',
        },
        {
            title: 'Name',
            key: 'name',
            width: '60%',
            render: (a) =>{
                return <><a href={a.url}>{a.name}</a></>
            }
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a:any, b:any) => a.rating - b.rating,
            },
        {
            title: 'Solved',
            dataIndex: 'solved',
            key: 'solved',
            sorter: (a:any, b:any) => a.solved - b.solved
        },
    ];
    async function updateProblemsData(){
        const problems = await loadProblemsList(resource);
        const problemRows = problems.map((p: Problem,index: number) => {
            return {
                key: p.id,
                sno: index + 1,
                name: p.name,
                id: p.short,
                solved: p.n_accepted,
                rating: p.rating,
                url: p.url
            } as ProblemRow;
        });
        setDataSource(problemRows);
    }
    const onTableChange = useCallback((pagination: TablePaginationConfig) => {
        (async function() {
            setLoading(true);
            setPagination(pagination);
            setLoading(false);
        })();
    }, [resource]);
    useEffect(() => {
        (async function() {
            const resourceChanged = resource !== prevResourceRef.current;
            setLoading(true);
            if (resourceChanged) {
                await updateProblemsData();
            }
            setLoading(false);

            prevResourceRef.current = resource;
        })();
    }, [resource]);

    return (
        <div>
            <Table
                dataSource={dataSource}
                pagination={pagination}
                onChange={onTableChange}
                loading={loading}
                columns={columns} >
            </Table>;  
        </div>
    );
}

export default AllProblemsList


