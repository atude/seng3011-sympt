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
  case "grey":
    return Colors.dull;
  case "white":
    return "#fff";
  default: return Colors.primary;
  }
};

export default mapColors;