import React, { useEffect, useState } from 'react';
import { AutoComplete, Form } from 'antd';
import { usePrefixedTranslation } from 'hooks';
import { useStoreActions } from 'store';

type Status = '' | 'warning' | 'error' | undefined;

interface Props {
  formName: string;
  setStatus?: (value: Status) => void;
}

const DockerNetworkName: React.FC<Props> = ({ formName, setStatus }) => {
  const { l } = usePrefixedTranslation('cmps.common.form.DockerNetworkName');

  const { getExternalDockerNetworks } = useStoreActions(s => s.network);

  const [dockerNetworks, setDockerNetworks] = useState<string[]>([]);
  const [inputStatus, setInputStatus] = useState<Status>(undefined);
  const [help, setHelp] = useState<string>('');

  const setLocalStatus = (value: Status) => {
    setStatus && setStatus(value);
    setInputStatus(value);
  };

  useEffect(() => {
    (async () => {
      const networks = await getExternalDockerNetworks();
      setDockerNetworks(networks);
    })();
  }, []);

  const validateNetworkName = async (value: string) => {
    if (value.length === 0 || value === 'default') {
      setHelp(l('helpClear'));
      setLocalStatus(undefined);
      return;
    }
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{1,63}$/;
    if (regex.test(value)) {
      if (!dockerNetworks.includes(value)) {
        setHelp(l('helpCreate'));
        setLocalStatus('warning');
      } else {
        setHelp(l('helpAttach', { dockerNetwork: value }));
        setLocalStatus(undefined);
      }
    } else {
      setHelp(l('helpInvalid'));
      setLocalStatus('error');
    }
  };

  return (
    <Form.Item name={formName} label={l('label')} help={help}>
      <AutoComplete
        options={dockerNetworks?.map(network => ({
          value: network,
        }))}
        placeholder={l('placeholder')}
        filterOption={(inputValue, option) =>
          option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onChange={validateNetworkName}
        status={inputStatus}
      />
    </Form.Item>
  );
};

export default DockerNetworkName;
