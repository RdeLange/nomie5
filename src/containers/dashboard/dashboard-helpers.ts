import { strToColor } from "../../components/dymoji/dymoji";
import type { Widget, WidgetConfig } from "../../modules/dashboard/widget";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { Dashboard } from "../../modules/dashboard/dashboard";

export function getWidgetColor(block: Widget, elementnumber) {
  if (elementnumber.includes("1")) {
    if (block.element && block.element.obj && block.element.obj.color) {
      return block.element.obj.color;
    } else {
      return strToColor(block.element.id);
    }
  }
  if (elementnumber.includes("2") && block.secElement1) {
    if (block.secElement1 && block.secElement1.obj && block.secElement1.obj.color) {
      return block.secElement1.obj.color;
    } else {
      return strToColor(block.secElement1.id);
    }
  }
  if (elementnumber.includes("3") && block.secElement2) {
    if (block.secElement2 && block.secElement2.obj && block.secElement2.obj.color) {
      return block.secElement2.obj.color;
    } else {
      return strToColor(block.secElement2.id);
    }
  }
}



export function formatValue(value, block: WidgetConfig): string {
  if (block.element.obj && block.element.obj.displayValue) {
    return block.element.obj.displayValue(value);
  } else {
    return value;
  }
}
