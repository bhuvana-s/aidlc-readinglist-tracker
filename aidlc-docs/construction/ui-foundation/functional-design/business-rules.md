# Business Rules - UI Foundation

## Overview
This document defines the business rules and constraints for the UI Foundation unit, including design system rules, component behavior rules, and validation rules.

---

## 1. Design System Rules

### 1.1 Color Palette Rules

**Primary Colors**:
- Primary: `#3B82F6` (Blue) - Main brand color, primary actions
- Primary Dark: `#2563EB` - Hover states for primary elements
- Primary Light: `#DBEAFE` - Backgrounds, subtle highlights

**Secondary Colors**:
- Secondary: `#8B5CF6` (Purple) - Secondary actions, accents
- Secondary Dark: `#7C3AED` - Hover states for secondary elements
- Secondary Light: `#EDE9FE` - Backgrounds, subtle highlights

**Semantic Colors**:
- Success: `#10B981` (Green) - Success messages, completed status
- Warning: `#F59E0B` (Amber) - Warning messages, in-progress status
- Error: `#EF4444` (Red) - Error messages, destructive actions
- Info: `#06B6D4` (Cyan) - Informational messages

**Neutral Colors**:
- Gray 900: `#111827` - Primary text
- Gray 700: `#374151` - Secondary text
- Gray 500: `#6B7280` - Tertiary text, placeholders
- Gray 300: `#D1D5DB` - Borders, dividers
- Gray 100: `#F3F4F6` - Backgrounds, subtle fills
- White: `#FFFFFF` - Page background, card backgrounds
- Black: `#000000` - Maximum contrast text (rare use)

**Color Usage Rules**:
- RULE 1.1.1: Primary color used for main CTAs (Call-to-Action buttons)
- RULE 1.1.2: Secondary color used for less prominent actions
- RULE 1.1.3: Semantic colors used only for their intended purpose (success = green, error = red)
- RULE 1.1.4: Text must have minimum 4.5:1 contrast ratio against background (WCAG AA)
- RULE 1.1.5: Never use color alone to convey information (include text/icons)

### 1.2 Typography Rules

**Font Families**:
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Monospace: `'Fira Code', 'Courier New', monospace` (for code/data display)

**Font Sizes**:
- xs: `12px` - Small labels, captions
- sm: `14px` - Secondary text, form labels
- base: `16px` - Body text, default size
- lg: `18px` - Emphasized text
- xl: `20px` - Section headings
- 2xl: `24px` - Page headings
- 3xl: `30px` - Main titles

**Font Weights**:
- Normal: `400` - Body text
- Medium: `500` - Emphasized text
- Semibold: `600` - Headings, buttons
- Bold: `700` - Strong emphasis (rare use)

**Line Heights**:
- Tight: `1.25` - Headings
- Normal: `1.5` - Body text
- Relaxed: `1.75` - Long-form content

**Typography Rules**:
- RULE 1.2.1: Base font size is 16px (never smaller for body text)
- RULE 1.2.2: Headings use semibold (600) weight
- RULE 1.2.3: Body text uses normal (400) weight
- RULE 1.2.4: Line height for body text is 1.5 for readability
- RULE 1.2.5: Maximum line length is 75 characters for readability

### 1.3 Spacing Rules

**Spacing Scale** (based on 4px base unit):
- xs: `4px` - Tight spacing
- sm: `8px` - Small spacing
- md: `16px` - Medium spacing (default)
- lg: `24px` - Large spacing
- xl: `32px` - Extra large spacing
- 2xl: `48px` - Section spacing
- 3xl: `64px` - Major section spacing

**Spacing Rules**:
- RULE 1.3.1: All spacing values must be multiples of 4px
- RULE 1.3.2: Default spacing between elements is 16px (md)
- RULE 1.3.3: Form fields have 8px (sm) vertical spacing
- RULE 1.3.4: Sections have 32px (xl) vertical spacing
- RULE 1.3.5: Page margins are 24px (lg) on desktop, 16px (md) on mobile

### 1.4 Border Rules

**Border Widths**:
- Thin: `1px` - Default borders
- Medium: `2px` - Emphasized borders
- Thick: `4px` - Strong emphasis (rare use)

**Border Radius**:
- sm: `4px` - Buttons, inputs
- md: `8px` - Cards, containers
- lg: `12px` - Large containers
- full: `9999px` - Pills, circular elements

**Border Rules**:
- RULE 1.4.1: Default border width is 1px
- RULE 1.4.2: Default border color is Gray 300 (`#D1D5DB`)
- RULE 1.4.3: Default border radius is 4px for interactive elements
- RULE 1.4.4: Cards use 8px border radius
- RULE 1.4.5: Focus outlines are 2px solid Primary color

### 1.5 Shadow Rules

**Shadow Definitions**:
- sm: `0 1px 2px rgba(0, 0, 0, 0.05)` - Subtle elevation
- md: `0 4px 6px rgba(0, 0, 0, 0.1)` - Standard elevation
- lg: `0 10px 15px rgba(0, 0, 0, 0.1)` - High elevation
- xl: `0 20px 25px rgba(0, 0, 0, 0.15)` - Maximum elevation

**Shadow Rules**:
- RULE 1.5.1: Cards use md shadow by default
- RULE 1.5.2: Modals use xl shadow
- RULE 1.5.3: Dropdowns use lg shadow
- RULE 1.5.4: Hover states increase shadow by one level
- RULE 1.5.5: Never use shadows on flat UI elements (buttons, inputs)

### 1.6 Animation Rules

**Transition Durations**:
- Fast: `150ms` - Hover effects, focus states
- Normal: `300ms` - Standard transitions
- Slow: `500ms` - Complex animations

**Easing Functions**:
- Ease-in-out: `cubic-bezier(0.4, 0, 0.2, 1)` - Default easing
- Ease-out: `cubic-bezier(0, 0, 0.2, 1)` - Entering elements
- Ease-in: `cubic-bezier(0.4, 0, 1, 1)` - Exiting elements

**Animation Rules**:
- RULE 1.6.1: All transitions use 300ms duration by default
- RULE 1.6.2: Hover effects use 150ms duration
- RULE 1.6.3: All transitions use ease-in-out easing
- RULE 1.6.4: Animations respect `prefers-reduced-motion` media query
- RULE 1.6.5: No animations longer than 500ms

---

## 2. Component Behavior Rules

### 2.1 Button Component Rules

**Button States**:
- Default: Base styling
- Hover: Darker background, subtle scale (1.02)
- Active: Even darker background, scale (0.98)
- Disabled: Reduced opacity (0.5), no pointer events
- Focus: 2px outline in Primary color

**Button Variants**:
- Primary: Primary color background, white text
- Secondary: Secondary color background, white text
- Outline: Transparent background, colored border and text
- Ghost: Transparent background, colored text, no border

**Button Sizes**:
- Small: 32px height, 12px padding, 14px font
- Medium: 40px height, 16px padding, 16px font (default)
- Large: 48px height, 20px padding, 18px font

**Button Rules**:
- RULE 2.1.1: Buttons must have minimum 40px height for touch targets
- RULE 2.1.2: Button text must be semibold (600) weight
- RULE 2.1.3: Disabled buttons cannot be clicked or focused
- RULE 2.1.4: Primary buttons used for main actions only (one per screen)
- RULE 2.1.5: Destructive actions use Error color (red)
- RULE 2.1.6: Button text must be concise (1-3 words)

### 2.2 Input Component Rules

**Input Types**:
- Text: Single-line text input
- Number: Numeric input with validation
- Email: Email input with format validation
- Password: Masked text input

**Input States**:
- Default: Gray border, white background
- Focus: Primary color border, no background change
- Error: Error color border, error message below
- Disabled: Gray background, reduced opacity
- Read-only: Gray background, no border change

**Input Rules**:
- RULE 2.2.1: Inputs must have minimum 40px height
- RULE 2.2.2: Input labels must be visible (no placeholder-only labels)
- RULE 2.2.3: Required fields marked with asterisk (*)
- RULE 2.2.4: Error messages shown below input in Error color
- RULE 2.2.5: Placeholder text uses Gray 500 color
- RULE 2.2.6: Input width should match expected content length
- RULE 2.2.7: Number inputs prevent non-numeric characters

### 2.3 Form Component Rules

**Form Layout**:
- Vertical layout (labels above inputs)
- 8px spacing between label and input
- 16px spacing between form fields
- 24px spacing before submit button

**Form Rules**:
- RULE 2.3.1: Forms validate on blur (when user leaves field)
- RULE 2.3.2: Forms validate all fields on submit
- RULE 2.3.3: First error field receives focus on validation failure
- RULE 2.3.4: Submit button disabled during submission
- RULE 2.3.5: Success message shown after successful submission
- RULE 2.3.6: Form cannot be submitted with validation errors
- RULE 2.3.7: Required fields must be marked visually

### 2.4 Card Component Rules

**Card Structure**:
- White background
- 8px border radius
- md shadow (4px)
- 16px padding (default)

**Card Rules**:
- RULE 2.4.1: Cards have white background
- RULE 2.4.2: Cards have 8px border radius
- RULE 2.4.3: Cards have md shadow for elevation
- RULE 2.4.4: Card padding is 16px by default
- RULE 2.4.5: Cards can be clickable (hover effect)
- RULE 2.4.6: Clickable cards increase shadow on hover

### 2.5 Modal Component Rules

**Modal Structure**:
- Overlay: Semi-transparent black background (rgba(0,0,0,0.5))
- Modal: White background, centered, xl shadow
- Header: Title, close button
- Body: Content area
- Footer: Action buttons (optional)

**Modal Behavior**:
- Modal opens with fade-in animation (300ms)
- Modal closes with fade-out animation (300ms)
- Clicking overlay closes modal (cancel action)
- ESC key closes modal (cancel action)
- Focus trapped within modal while open
- Focus returns to trigger element on close

**Modal Rules**:
- RULE 2.5.1: Only one modal open at a time
- RULE 2.5.2: Modal must have close button (X icon)
- RULE 2.5.3: Modal must have title
- RULE 2.5.4: Destructive actions require confirmation modal
- RULE 2.5.5: Modal width maximum 600px
- RULE 2.5.6: Modal height maximum 80% of viewport
- RULE 2.5.7: Modal content scrollable if exceeds height

### 2.6 Progress Bar Component Rules

**Progress Bar Structure**:
- Container: Gray 200 background, 8px height, full border radius
- Fill: Primary color, height matches container, border radius
- Percentage: Text display (optional)

**Progress Bar Rules**:
- RULE 2.6.1: Progress value between 0 and 100
- RULE 2.6.2: Progress bar height is 8px
- RULE 2.6.3: Progress fill uses Primary color
- RULE 2.6.4: Progress percentage displayed as text (e.g., "42%")
- RULE 2.6.5: Progress bar width is 100% of container
- RULE 2.6.6: Progress bar animates smoothly (300ms transition)

### 2.7 Star Rating Component Rules

**Star Rating Structure**:
- 5 stars displayed horizontally
- Filled stars: Primary color
- Empty stars: Gray 300 color
- Interactive mode: Clickable stars
- Display mode: Non-interactive stars

**Star Rating Rules**:
- RULE 2.7.1: Rating value between 0 and 5
- RULE 2.7.2: Half-star ratings not supported (whole numbers only)
- RULE 2.7.3: Interactive stars highlight on hover
- RULE 2.7.4: Clicking star sets rating to that star's value
- RULE 2.7.5: Display-only stars not clickable
- RULE 2.7.6: Star size is 24px by default
- RULE 2.7.7: Stars have 4px spacing between them

### 2.8 Notification Component Rules

**Notification Types**:
- Success: Green background, checkmark icon
- Error: Red background, X icon
- Warning: Amber background, exclamation icon
- Info: Cyan background, info icon

**Notification Behavior**:
- Notifications appear inline (not toast)
- Notifications can be dismissed with X button
- Notifications persist until dismissed
- Multiple notifications stack vertically

**Notification Rules**:
- RULE 2.8.1: Notifications use semantic colors
- RULE 2.8.2: Notifications include icon matching type
- RULE 2.8.3: Notification text is concise (1-2 sentences)
- RULE 2.8.4: Notifications have dismiss button
- RULE 2.8.5: Notifications have 16px padding
- RULE 2.8.6: Notifications have 8px border radius
- RULE 2.8.7: Multiple notifications have 8px vertical spacing

### 2.9 Loading Spinner Component Rules

**Spinner Structure**:
- Circular spinner with rotating animation
- Primary color
- Multiple sizes: small (16px), medium (32px), large (48px)

**Loading Overlay Structure**:
- Full-screen overlay
- Semi-transparent white background (rgba(255,255,255,0.8))
- Centered spinner (large size)
- Optional loading text below spinner

**Loading Rules**:
- RULE 2.9.1: Global loading overlay covers entire viewport
- RULE 2.9.2: Loading overlay prevents interaction with page
- RULE 2.9.3: Loading spinner uses Primary color
- RULE 2.9.4: Loading spinner rotates continuously (1s duration)
- RULE 2.9.5: Loading text is optional, centered below spinner
- RULE 2.9.6: Loading overlay has z-index 9999 (top layer)

---

## 3. Layout Rules

### 3.1 Responsive Breakpoints

**Breakpoint Definitions**:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px and above

**Breakpoint Rules**:
- RULE 3.1.1: Design for desktop first (1024px base)
- RULE 3.1.2: Scale down for tablet and mobile
- RULE 3.1.3: Touch targets minimum 44px on mobile
- RULE 3.1.4: Font sizes scale proportionally
- RULE 3.1.5: Spacing scales proportionally

### 3.2 Container Rules

**Container Widths**:
- Mobile: 100% width, 16px padding
- Tablet: 100% width, 24px padding
- Desktop: Maximum 1200px width, 24px padding, centered

**Container Rules**:
- RULE 3.2.1: Main content container maximum 1200px width
- RULE 3.2.2: Container centered on desktop
- RULE 3.2.3: Container full width on mobile and tablet
- RULE 3.2.4: Container has horizontal padding (16px mobile, 24px desktop)

### 3.3 Grid Rules

**Grid System**:
- 12-column grid
- 16px gutter between columns
- Flexible column widths

**Grid Rules**:
- RULE 3.3.1: Use 12-column grid for layouts
- RULE 3.3.2: Gutter width is 16px
- RULE 3.3.3: Columns stack vertically on mobile
- RULE 3.3.4: Grid adapts to container width

---

## 4. Accessibility Rules

### 4.1 Keyboard Navigation Rules

**Keyboard Rules**:
- RULE 4.1.1: All interactive elements must be keyboard accessible
- RULE 4.1.2: Tab order must be logical (top to bottom, left to right)
- RULE 4.1.3: Focus indicator must be visible (2px outline)
- RULE 4.1.4: ESC key closes modals and dropdowns
- RULE 4.1.5: Enter key activates buttons and links
- RULE 4.1.6: Space key activates buttons and checkboxes

### 4.2 ARIA Label Rules

**ARIA Rules**:
- RULE 4.2.1: All form inputs have associated labels
- RULE 4.2.2: Icon buttons have aria-label
- RULE 4.2.3: Decorative images have aria-hidden="true"
- RULE 4.2.4: Modals have aria-labelledby and aria-describedby
- RULE 4.2.5: Error messages have role="alert"
- RULE 4.2.6: Loading states have aria-live="polite"

### 4.3 Focus Management Rules

**Focus Rules**:
- RULE 4.3.1: Focus moves to modal when opened
- RULE 4.3.2: Focus returns to trigger element when modal closes
- RULE 4.3.3: Focus moves to first error field on validation failure
- RULE 4.3.4: Focus trapped within modal while open
- RULE 4.3.5: Focus indicator visible on all interactive elements

---

## 5. Validation Rules

### 5.1 Field Validation Rules

**Email Validation**:
- RULE 5.1.1: Email must contain @ symbol
- RULE 5.1.2: Email must have domain (e.g., example.com)
- RULE 5.1.3: Email format: `user@domain.ext`

**Password Validation**:
- RULE 5.1.4: Password minimum 8 characters
- RULE 5.1.5: Password must contain at least one letter
- RULE 5.1.6: Password must contain at least one number

**Number Validation**:
- RULE 5.1.7: Number fields accept only numeric input
- RULE 5.1.8: Number fields can specify min and max values
- RULE 5.1.9: Negative numbers allowed only if specified

**Text Validation**:
- RULE 5.1.10: Required text fields cannot be empty
- RULE 5.1.11: Text fields can specify maximum length
- RULE 5.1.12: Text fields trim whitespace before validation

### 5.2 Form Validation Rules

**Validation Timing**:
- RULE 5.2.1: Validate field on blur (when user leaves field)
- RULE 5.2.2: Validate all fields on form submit
- RULE 5.2.3: Clear error when user starts correcting

**Validation Display**:
- RULE 5.2.4: Show error message below field
- RULE 5.2.5: Error message in Error color (red)
- RULE 5.2.6: Error message concise (1 sentence)
- RULE 5.2.7: Field border changes to Error color when invalid

---

## 6. Error Handling Rules

### 6.1 Error Display Rules

**Error Display**:
- RULE 6.1.1: Errors displayed inline next to relevant component
- RULE 6.1.2: Error messages use Error color (red)
- RULE 6.1.3: Error messages include icon (X or exclamation)
- RULE 6.1.4: Error messages are concise (1-2 sentences)
- RULE 6.1.5: Error messages provide actionable guidance

### 6.2 Error Recovery Rules

**Error Recovery**:
- RULE 6.2.1: Errors clear when user corrects issue
- RULE 6.2.2: Errors clear on successful operation
- RULE 6.2.3: Errors clear when component unmounts
- RULE 6.2.4: User can retry failed operations

---

## 7. Performance Rules

### 7.1 Loading Rules

**Loading Performance**:
- RULE 7.1.1: Show loading indicator for operations > 500ms
- RULE 7.1.2: Loading timeout after 30 seconds
- RULE 7.1.3: Local storage operations should be < 100ms
- RULE 7.1.4: API calls should timeout after 10 seconds

### 7.2 Rendering Rules

**Rendering Performance**:
- RULE 7.2.1: Minimize re-renders (update only changed components)
- RULE 7.2.2: Debounce search input (300ms delay)
- RULE 7.2.3: Lazy load components not immediately visible
- RULE 7.2.4: Optimize images (compress, appropriate size)

---

## Summary

This document defines comprehensive business rules for:
- Design system (colors, typography, spacing, borders, shadows, animations)
- Component behavior (buttons, inputs, forms, cards, modals, progress bars, star ratings, notifications, loading spinners)
- Layout (responsive breakpoints, containers, grid)
- Accessibility (keyboard navigation, ARIA labels, focus management)
- Validation (field validation, form validation)
- Error handling (display, recovery)
- Performance (loading, rendering)

All rules are technology-agnostic and can be implemented in any modern JavaScript framework.
