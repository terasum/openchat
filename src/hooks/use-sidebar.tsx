import * as React from "react";

export function useSidebar() {
  const [showSidebar, setShowSidebar] = React.useState(true);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return {
    showSidebar,
    handleToggleSidebar,
  };
}
