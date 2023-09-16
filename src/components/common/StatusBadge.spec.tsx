import React from 'react';
import { Status } from 'shared/types';
import { renderWithProviders } from 'utils/tests';
import StatusBadge from './StatusBadge';

describe('StatusTag Component', () => {
  const renderComponent = (status: Status, text?: string) => {
    return renderWithProviders(<StatusBadge status={status} text={text} />);
  };

  it('should render the Starting status', () => {
    const { container } = renderComponent(Status.Starting);
    const element = container.querySelector(
      '.ant-badge-status-dot.ant-badge-status-processing',
    );

    expect(element).not.toBeNull();
  });

  it('should render the Started status', () => {
    const { container } = renderComponent(Status.Started);
    const element = container.querySelector(
      '.ant-badge-status-dot.ant-badge-status-success',
    );

    expect(element).not.toBeNull();
  });

  it('should render the Stopping status', () => {
    const { container } = renderComponent(Status.Stopping);
    const element = container.querySelector(
      '.ant-badge-status-dot.ant-badge-status-processing',
    );

    expect(element).not.toBeNull();
  });

  it('should render the Stopped status', () => {
    const { container } = renderComponent(Status.Stopped);
    const element = container.querySelector(
      '.ant-badge-status-dot.ant-badge-status-default',
    );

    expect(element).not.toBeNull();
  });

  it('should render the Error status', () => {
    const { container } = renderComponent(Status.Error);
    const element = container.querySelector(
      '.ant-badge-status-dot.ant-badge-status-error',
    );

    expect(element).not.toBeNull();
  });
});
