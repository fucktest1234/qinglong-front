import React, { useEffect, useState } from 'react';
import { Modal, message, Input, Form } from 'antd';
import { request } from '@/utils/http';
import config from '@/utils/config';

const CronModal = ({
  handleCancel,
  visible,
}: {
  visible: boolean;
  handleCancel: (needUpdate?: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async (values: any) => {
    console.log(values);
    if (values.url.indexOf('http') < 0) {
      message.error('url格式不正确, 请修改');
      return;
    }
    // 发送请求。
    setLoading(true);
    const method = 'post';
    const payload = { ...values };
    const res = await request[method](`${config.apiPrefix}rawfile`, {
      data: payload,
    });
    if (res.code === 200) {
      message.success(res.message);
      handleCancel();
    } else {
      message.error(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  return (
    <Modal
      title={'添加raw文件'}
      visible={visible}
      forceRender
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            handleOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      onCancel={() => handleCancel()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="url" label="github/gitee-raw地址" required>
          <Input placeholder="请输入raw地址" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CronModal;
