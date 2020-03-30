import Colors from "../constants/Colors";

const mapColors = (variant) => {
  switch(variant) {
    case "primary": 
      return Colors.primary;
    case "secondary":
      return Colors.secondary;
    case "success":
      return Colors.success;
    case "warning":
      return Colors.warning;
    case "error":
      return Colors.error;
    default: return Colors.primary;
  }
};

export default mapColors;