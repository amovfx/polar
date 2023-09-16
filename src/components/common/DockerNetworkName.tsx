import React, { useEffect, useState } from 'react';
import { AutoComplete, Form } from 'antd';
import { useStoreActions } from 'store';

type Status = '' | 'warning' | 'error' | undefined;

interface Props {
  formName: string;
  status?: Status;
  setStatus?: (value: Status) => void;
}

const DockerNetworkName: React.FC<Props> = ({ formName, setStatus }) => {
  const { getExternalDockerNetworks } = useStoreActions(s => s.network);
  const [dockerNetworks, setDockerNetworks] = useState<string[]>([]);
  const [_status, _setStatus] = useState<Status>(undefined);

  const [help, setHelp] = useState<string>('');

  const setLocalStatus = (value: Status) => {
    setStatus && setStatus(value);
    _setStatus(value);
  };

  useEffect(() => {
    (async () => {
      const networks = await getExternalDockerNetworks();
      setDockerNetworks(networks);
    })();
  }, []);

  const validateNetworkName = async (value: string) => {
    if (value.length === 0 || value === 'default') {
      setHelp('Docker Network will be cleared');
      setLocalStatus(undefined);
      return;
    }
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{1,63}$/;
    if (regex.test(value)) {
      if (!dockerNetworks.includes(value)) {
        setHelp('Docker External Network will be created');
        setLocalStatus('warning');
      } else {
        setHelp(`Docker Network will be attached to ${value}`);
        setLocalStatus(undefined);
      }
    } else {
      setHelp('Invalid Docker Network Name');
      setLocalStatus('error');
    }
  };

  return (
    <Form.Item name={formName} label="External Docker Network" help={help}>
      <AutoComplete
        options={dockerNetworks?.map(network => ({
          value: network,
        }))}
        placeholder="Select a network leave blank to clear"
        filterOption={(inputValue, option) =>
          option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onChange={validateNetworkName}
        status={_status}
      />
    </Form.Item>
  );
};

export default DockerNetworkName;
