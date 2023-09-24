import React from 'react';
import { OpenDialogReturnValue, remote } from 'electron';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Col, Collapse, Form, Input, Row } from 'antd';
import DockerNetworkName from 'components/common/DockerNetworkName';

interface Props {
  setIsDockerNetworkNameValid: (value: boolean) => void;
}

const NewNetworkOptions: React.FC<Props> = ({ setIsDockerNetworkNameValid }) => {
  const selectDirectory = async () => {
    const result: OpenDialogReturnValue = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      form.setFieldsValue({ externalNetworkPath: result.filePaths[0] });
    } else {
      form.setFieldsValue({ externalNetworkPath: undefined });
    }
  };
  return (
    <Collapse defaultActiveKey={['0']} ghost>
      <Collapse.Panel header="Advanced Options" key="1">
        <Row gutter={16}>
          <Col span={12}>
            <DockerNetworkName
              name="externalNetworkName"
              validateCallback={setIsDockerNetworkNameValid}
            />
          </Col>
          <Col span={12}>
            <Form.Item name="externalNetworkPath" label="External Network Path">
              <Input
                suffix={<FolderOpenOutlined onClick={selectDirectory} />}
                placeholder="Select a directory"
              />
            </Form.Item>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  );
};

export default NewNetworkOptions;
