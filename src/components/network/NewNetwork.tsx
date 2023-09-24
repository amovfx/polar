import React, { useEffect, useState } from 'react';
import { useAsyncCallback } from 'react-async-hook';
import { OpenDialogReturnValue, remote } from 'electron';
import { info } from 'electron-log';
import { FolderOpenOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  PageHeader,
  Row,
} from 'antd';
import { usePrefixedTranslation } from 'hooks';
import { useTheme } from 'hooks/useTheme';
import { useStoreActions, useStoreState } from 'store';
import { ThemeColors } from 'theme/colors';
import { dockerConfigs } from 'utils/constants';
import { isWindows } from 'utils/system';
import DockerNetworkName from 'components/common/DockerNetworkName';
import { HOME } from 'components/routing';

const Styled = {
  PageHeader: styled(PageHeader)<{ colors: ThemeColors['pageHeader'] }>`
    border: 1px solid ${props => props.colors.border};
    border-radius: 2px;
    background-color: ${props => props.colors.background};
    margin-bottom: 10px;
    flex: 0;
  `,
  Divider: styled(Divider)`
    .ant-divider-inner-text {
      font-size: 14px;
      opacity: 0.5;
    }
  `,
};

const NewNetwork: React.SFC = () => {
  useEffect(() => info('Rendering NewNetwork component'), []);

  const [form] = Form.useForm();

  const { l } = usePrefixedTranslation('cmps.network.NewNetwork');
  const theme = useTheme();
  const { navigateTo, notify } = useStoreActions(s => s.app);
  const { addNetwork } = useStoreActions(s => s.network);
  const { settings } = useStoreState(s => s.app);
  const { custom: customNodes } = settings.nodeImages;

  const [isDockerNetworkNameValid, setIsDockerNetworkNameValid] = useState<boolean>(true);

  const createAsync = useAsyncCallback(async (values: any) => {
    try {
      values.customNodes = values.customNodes || {};
      await addNetwork(values);
    } catch (error: any) {
      notify({ message: l('createError'), error });
    }
  });

  const initialCustomValues = customNodes.reduce((result, node) => {
    result[node.id] = 0;
    return result;
  }, {} as Record<string, number>);

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
    <>
      <Styled.PageHeader
        title={l('title')}
        colors={theme.pageHeader}
        onBack={() => navigateTo(HOME)}
      />
      <Card>
        <Form
          layout="vertical"
          colon={false}
          initialValues={{
            lndNodes: isWindows() ? 2 : 1,
            clightningNodes: isWindows() ? 0 : 1,
            eclairNodes: 1,
            bitcoindNodes: 1,
            customNodes: initialCustomValues,
            externalNetworkName: '',
            externalNetworkPath: undefined,
          }}
          onFinish={createAsync.execute}
          form={form}
        >
          <Col>
            <Form.Item
              name="name"
              label={l('nameLabel')}
              rules={[{ required: true, message: l('cmps.forms.required') }]}
            >
              <Input placeholder={l('namePhldr')} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <DockerNetworkName
                  formName="externalNetworkName"
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
          </Col>
          {customNodes.length > 0 && (
            <>
              <Styled.Divider orientation="left">{l('customLabel')}</Styled.Divider>
              <Row>
                {customNodes.map(node => (
                  <Col span={6} key={node.id}>
                    <Form.Item
                      name={['customNodes', node.id]}
                      label={node.name}
                      rules={[{ required: true, message: l('cmps.forms.required') }]}
                    >
                      <InputNumber min={0} max={10} />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </>
          )}
          <Styled.Divider orientation="left">{l('managedLabel')}</Styled.Divider>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="lndNodes"
                label={dockerConfigs.LND.name}
                rules={[{ required: true, message: l('cmps.forms.required') }]}
              >
                <InputNumber min={0} max={10} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="clightningNodes"
                label={dockerConfigs['c-lightning'].name}
                extra={isWindows() ? l('clightningWindows') : ''}
                rules={[{ required: true, message: l('cmps.forms.required') }]}
              >
                <InputNumber min={0} max={10} disabled={isWindows()} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="eclairNodes"
                label={dockerConfigs.eclair.name}
                rules={[{ required: true, message: l('cmps.forms.required') }]}
              >
                <InputNumber min={0} max={10} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="bitcoindNodes"
                label={dockerConfigs.bitcoind.name}
                rules={[{ required: true, message: l('cmps.forms.required') }]}
              >
                <InputNumber min={1} max={10} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createAsync.loading}
              disabled={!isDockerNetworkNameValid}
            >
              {l('btnCreate')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default NewNetwork;
