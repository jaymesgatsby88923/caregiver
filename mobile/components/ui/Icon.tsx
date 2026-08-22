import { SvgXml } from "react-native-svg";

const xml = {
  "logo-mark": `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#logo_clip)"><path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#E6F4F1"/><path d="M19.9994 27.272C19.9994 27.272 10.908 20.9082 10.908 15.9081C10.908 13.0899 13.0899 10.908 15.9083 10.908C17.4538 10.908 18.9085 11.7262 19.9994 12.908C21.0904 11.7262 22.545 10.908 24.9997 10.908C27.8181 10.908 30 13.0899 30 15.9081C30 20.9082 19.9994 27.272 19.9994 27.272Z" fill="#FF6B6B"/></g><defs><clipPath id="logo_clip"><rect width="40" height="40" fill="white"/></clipPath></defs></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3.49972V7L9.33352 8.16676M12.8338 7C12.8338 10.2219 10.2219 12.8338 7 12.8338C3.77808 12.8338 1.1662 10.2219 1.1662 7C1.1662 3.77808 3.77808 1.1662 7 1.1662C10.2219 1.1662 12.8338 3.77808 12.8338 7Z" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/></svg>`,
  "map-pin": `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.35055 12.7167C8.43544 11.7798 11.6662 8.74615 11.6662 5.8333C11.6662 4.59551 11.1746 3.40841 10.2995 2.53316C9.42442 1.65791 8.23755 1.1662 7 1.1662C5.76245 1.1662 4.57558 1.65791 3.7005 2.53316C2.82542 3.40841 2.3338 4.59551 2.3338 5.8333C2.3338 8.74615 5.56456 11.7798 6.64945 12.7167C6.75052 12.7927 6.87355 12.8338 7 12.8338C7.12645 12.8338 7.24948 12.7927 7.35055 12.7167Z" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/></svg>`,
  user: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2506 15.75V14.25C14.2506 13.4544 13.9345 12.6913 13.3718 12.1287C12.8091 11.5661 12.046 11.25 11.2503 11.25H6.74974C5.954 11.25 5.19085 11.5661 4.62818 12.1287C4.06551 12.6913 3.7494 13.4544 3.7494 14.25V15.75M12.0003 5.25C12.0003 6.90685 10.657 8.25 9 8.25C7.34296 8.25 5.99966 6.90685 5.99966 5.25C5.99966 3.59315 7.34296 2.25 9 2.25C10.657 2.25 12.0003 3.59315 12.0003 5.25Z" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.9994 4.5L6.75023 12.7494L3.0006 8.99967" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/></svg>`,
  "check-square": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7.104V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H11.5627M6 7.33333L8 9.33333L14.6667 2.66667" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/></svg>`,
  "circle-x": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0002 5.99984L5.99984 10.0002M5.99984 5.99984L10.0002 10.0002M14.6672 8C14.6672 11.6822 11.6822 14.6672 8 14.6672C4.31781 14.6672 1.3328 11.6822 1.3328 8C1.3328 4.31781 4.31781 1.3328 8 1.3328C11.6822 1.3328 14.6672 4.31781 14.6672 8Z" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round"/></svg>`,
  "arrow-left": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3.3328L3.3328 8L8 12.6672M3.3328 8H12.6672" stroke="#0A2540" stroke-width="2" stroke-linecap="round"/></svg>`,
  note: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.333 2H4.667C3.93 2 3.333 2.597 3.333 3.333v9.334C3.333 13.403 3.93 14 4.667 14h6.666c.737 0 1.334-.597 1.334-1.333V6L9.333 2Z" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.333 2v4h4M6 8.667h4M6 11.333h4" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/></svg>`,
  house: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.5 31.4988V19.4988C22.5 19.101 22.342 18.7194 22.0607 18.4381C21.7794 18.1568 21.3978 17.9988 21 17.9988H15C14.6022 17.9988 14.2206 18.1568 13.9393 18.4381C13.658 18.7194 13.5 19.101 13.5 19.4988V31.4988M4.5 14.9995C4.4999 14.5631 4.595 14.132 4.77868 13.7361C4.96236 13.3402 5.2302 12.9892 5.5635 12.7075L16.0635 3.70752C16.605 3.24988 17.291 2.9988 18 2.9988C18.709 2.9988 19.395 3.24988 19.9365 3.70752L30.4365 12.7075C30.7698 12.9892 31.0376 13.3402 31.2213 13.7361C31.405 14.132 31.5001 14.5631 31.5 14.9995V28.4995C31.5 29.2952 31.1839 30.0582 30.6213 30.6208C30.0587 31.1834 29.2956 31.4995 28.5 31.4995H7.5C6.70435 31.4995 5.94129 31.1834 5.37868 30.6208C4.81607 30.0582 4.5 29.2952 4.5 28.4995V14.9995Z" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/></svg>`,
  "pulse-dot": `<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="3" cy="3" r="3" fill="#14B8A6"/></svg>`,
} as const;

export type IconName = keyof typeof xml;

const sizes: Record<IconName, number> = {
  "logo-mark": 40,
  clock: 14,
  "map-pin": 14,
  user: 18,
  check: 18,
  "check-square": 16,
  "circle-x": 16,
  "arrow-left": 16,
  note: 16,
  house: 36,
  "pulse-dot": 6,
};

type IconProps = {
  name: IconName;
  size?: number;
};

export function Icon({ name, size }: IconProps) {
  const resolved = size ?? sizes[name];
  return <SvgXml xml={xml[name]} width={resolved} height={resolved} />;
}
