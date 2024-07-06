import { useCallback, useState } from 'react'
import { Alert, Tabs, TabsProps } from 'antd'
import { R_CC, R_LC } from '../apis'
import { LOCAL_HIDE_ALERT_RETRY } from '../services/localstorage'
import AllProblemsList from './AllProblemsList'

const items: TabsProps['items'] = [
  {
      key: R_LC,
      label: 'LeetCode',
  },
  {
      key: R_CC,
      label: 'CodeChef',
  },
];

export const AllProblems = () => {
  const [resource, setResource] = useState<string>(R_LC);

const onTabChange = useCallback((activeKey: string) => {
    setResource(activeKey);
}, []);

const hideAlertRetry = localStorage.getItem(LOCAL_HIDE_ALERT_RETRY);
  return (
    <div>
      { !hideAlertRetry && <Alert message="It may cost more time when loading contests at the first time. If failed, please switch LeetCode/CodeChef tabs to retry." type="info" showIcon closable onClose={() => localStorage.setItem(LOCAL_HIDE_ALERT_RETRY, '1')} />}
        <Tabs items={items} destroyInactiveTabPane onChange={onTabChange} style={{ marginBottom: '16px' }}></Tabs>
        <AllProblemsList resource={resource} />
    </div>
  )
}
