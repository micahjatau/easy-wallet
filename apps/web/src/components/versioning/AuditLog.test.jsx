import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AuditLog from './AuditLog.jsx'

const buildLog = (id, action) => ({
  id,
  action,
  transaction_id: `txn-${id}`,
  changed_at: `2026-02-07T10:${String(id).padStart(2, '0')}:00.000Z`,
  changed_by: 'tester',
  previous_state: { id: `prev-${id}` },
  new_state: { id: `next-${id}` },
})

describe('AuditLog filtering and density controls', () => {
  it('shows empty prompt by default until filter is selected', () => {
    render(
      <AuditLog
        logs={[
          buildLog(1, 'create'),
          buildLog(2, 'delete'),
          buildLog(3, 'restore'),
        ]}
        isLoading={false}
      />,
    )

    expect(screen.getByText('Select a filter to view audit logs.')).toBeInTheDocument()
    expect(screen.queryByText('Deleted')).not.toBeInTheDocument()
  })

  it('shows only delete entries when delete filter is selected', () => {
    render(
      <AuditLog
        logs={[
          buildLog(1, 'create'),
          buildLog(2, 'delete'),
          buildLog(3, 'update'),
          buildLog(4, 'restore'),
        ]}
        isLoading={false}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(screen.getByText('Deleted')).toBeInTheDocument()
    expect(screen.queryByText('Created')).not.toBeInTheDocument()
    expect(screen.queryByText('Updated')).not.toBeInTheDocument()
    expect(screen.queryByText('Restored')).not.toBeInTheDocument()
  })

  it('shows all actions when all filter is selected', () => {
    render(
      <AuditLog
        logs={[
          buildLog(1, 'create'),
          buildLog(2, 'delete'),
          buildLog(3, 'update'),
          buildLog(4, 'restore'),
        ]}
        isLoading={false}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Deleted')).toBeInTheDocument()
    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('Restored')).toBeInTheDocument()
  })

  it('resets expanded row when filter changes', () => {
    render(
      <AuditLog
        logs={[
          buildLog(1, 'delete'),
          buildLog(2, 'create'),
        ]}
        isLoading={false}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    fireEvent.click(screen.getByText('Deleted'))
    expect(screen.getByText('Transaction ID:')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(screen.queryByText('Transaction ID:')).not.toBeInTheDocument()
  })

  it('supports show more and show less for long filtered lists', () => {
    const logs = Array.from({ length: 20 }, (_, index) =>
      buildLog(index + 1, 'delete'),
    )

    render(<AuditLog logs={logs} isLoading={false} />)

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getAllByText('Deleted')).toHaveLength(15)

    fireEvent.click(screen.getByRole('button', { name: 'Show more' }))
    expect(screen.getAllByText('Deleted')).toHaveLength(20)

    fireEvent.click(screen.getByRole('button', { name: 'Show less' }))
    expect(screen.getAllByText('Deleted')).toHaveLength(15)
  })
})
