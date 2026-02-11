import { useMemo } from 'react'
import BaseCurrencyChangeDialog from '../components/BaseCurrencyChangeDialog.jsx'
import BottomNav from '../components/BottomNav.jsx'
import DeleteBanner from '../components/DeleteBanner.jsx'
import Layout from '../components/Layout.jsx'
import OfflineBanner from '../components/OfflineBanner.jsx'
import ActivitySectionView from './ActivitySectionView.jsx'
import AppHeaderView from './AppHeaderView.jsx'
import DesktopDashboardView from './DesktopDashboardView.jsx'
import MobileShellView from './MobileShellView.jsx'
import ToolsSectionView from './ToolsSectionView.jsx'

const AppShellView = ({
  layout,
  header,
  deleteBanner,
  dashboard,
  activity,
  tools,
  mobile,
  connectivity,
  dialog,
}) => {
  const affectedTransactionsCount = useMemo(() => {
    if (!dialog.showBaseCurrencyDialog || !dialog.pendingBaseCurrency) return 0
    return dialog.transactions.filter(
      (transaction) =>
        transaction.currency !== dialog.pendingBaseCurrency &&
        transaction.currency !== dialog.settings.baseCurrency,
    ).length
  }, [
    dialog.showBaseCurrencyDialog,
    dialog.pendingBaseCurrency,
    dialog.transactions,
    dialog.settings.baseCurrency,
  ])

  return (
    <Layout
      isDarkMode={layout.isDarkMode}
      bottomNav={<BottomNav activeView={layout.activeView} onSetView={layout.handleSetView} />}
    >
      <AppHeaderView {...header} />

      <DeleteBanner
        deleteBanner={deleteBanner.deleteBanner}
        onUndo={deleteBanner.handleUndoDelete}
        onDismiss={deleteBanner.handleDismissDeleteBanner}
      />

      <DesktopDashboardView {...dashboard} />

      <ActivitySectionView {...activity} />

      <ToolsSectionView
        desktopToolsSections={tools.desktopToolsSections}
        isDarkMode={tools.isDarkMode}
      />

      <MobileShellView {...mobile} />

      <OfflineBanner isOnline={connectivity.isOnline} />

      <BaseCurrencyChangeDialog
        isOpen={dialog.showBaseCurrencyDialog}
        currentCurrency={dialog.settings.baseCurrency}
        newCurrency={dialog.pendingBaseCurrency}
        affectedTransactionsCount={affectedTransactionsCount}
        onConfirm={dialog.confirmBaseCurrencyChange}
        onCancel={() => {
          dialog.setShowBaseCurrencyDialog(false)
          dialog.setPendingBaseCurrency(null)
        }}
      />
    </Layout>
  )
}

export default AppShellView
