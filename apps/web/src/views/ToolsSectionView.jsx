import ToolsAccordion from '../components/ToolsAccordion.jsx'

const ToolsSectionView = ({ desktopToolsSections, isDarkMode }) => {
  return (
    <section className="hidden lg:block mt-6">
      <ToolsAccordion sections={desktopToolsSections} isDarkMode={isDarkMode} />
    </section>
  )
}

export default ToolsSectionView
