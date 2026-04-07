# Cognitive Canvas - Theme Quick Reference

## 🎨 Color Tokens

### Light Mode (Default)

```css
/* Surfaces */
--surface: #f7f9fb              /* Main background */
--surface-container-low: #f2f4f6
--surface-container-lowest: #ffffff
--surface-container-high: #e0e3e5

/* Primary - Intelligence */
--primary: #392cc1              /* Deep indigo */
--primary-container: #534ad9
--primary-fixed: #e3dfff

/* Tertiary - AI Insights */
--tertiary: #006d7e             /* Teal */
--tertiary-fixed: #acedff       /* Light cyan */

/* Text */
--on-surface: #191c1e           /* Primary text */
--on-surface-variant: #464555   /* Secondary text */
```

### Dark Mode

```css
/* Surfaces */
--surface: #0c1324              /* Obsidian background */
--surface-container-low: #151b2d
--surface-container-lowest: #12182a
--surface-container-high: #23293c

/* Primary - Intelligence */
--primary: #c0c1ff              /* Light indigo */
--primary-container: #4b4dd8
--primary-fixed: #dce1fb

/* Tertiary - AI Insights */
--tertiary: #ffb695             /* Warm peach */
--tertiary-fixed: #ffdbcc       /* Light coral */

/* Text */
--on-surface: #dce1fb           /* Primary text */
--on-surface-variant: #a8b5ff   /* Secondary text */
```

---

## 🧩 Component Usage

### Cards

```tsx
// Default card - theme aware
<Card variant="default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Cognitive card - AI content with glassmorphism
<Card variant="cognitive">
  AI-generated insights here
</Card>
```

### Buttons

```tsx
// Primary - with AI gradient
<Button variant="primary">
  Main Action
</Button>

// Secondary - outline style
<Button variant="secondary">
  Secondary Action
</Button>

// Ghost - text only
<Button variant="ghost">
  Cancel
</Button>
```

### Badges

```tsx
// Default - surface color
<Badge variant="default">Status</Badge>

// Primary - indigo accent
<Badge variant="primary">Important</Badge>

// Tertiary - AI insight
<Badge variant="tertiary">AI Suggestion</Badge>

// Success/Warning
<Badge variant="success">Completed</Badge>
<Badge variant="warning">At Risk</Badge>
```

---

## 🎯 Design Patterns

### The "No-Line" Rule

❌ **Don't**: Use borders to separate sections
```tsx
<div className="border-b border-gray-200">...</div>
```

✅ **Do**: Use tonal shifts
```tsx
<div className="bg-surface-container-low">...</div>
```

### Tonal Layering

```tsx
// Background layers (light mode example)
<div className="bg-surface">              {/* Level 0 */}
  <div className="bg-surface-container-low">    {/* Level 1 */}
    <div className="bg-surface-container-lowest"> {/* Level 2 */}
      Content
    </div>
  </div>
</div>
```

### Glassmorphism

```tsx
// Floating AI panel
<div className="glass bg-surface-container-lowest/80 backdrop-blur-glass">
  AI Insights
</div>
```

### AI Intelligence Spark

```tsx
// Special container for AI content
<div className="ai-spark p-4 border-l-4 border-tertiary-fixed">
  AI-generated recommendation
</div>
```

---

## 🌗 Theme Switching

### Manual Toggle

```tsx
// Toggle dark mode
document.documentElement.classList.add('dark');

// Toggle light mode
document.documentElement.classList.remove('dark');

// Check current theme
const isDark = document.documentElement.classList.contains('dark');
```

### With Component

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// In your UI
<ThemeToggle />
```

---

## 📏 Spacing & Typography

### Font Scale

```tsx
// Display (Manrope)
className="font-display text-display-lg"    // 3.5rem
className="font-display text-display-md"    // 2.5rem
className="font-display text-display-sm"    // 2rem

// Body (Inter)
className="font-body text-body-lg"          // 1.125rem
className="font-body text-body-md"          // 1rem
className="font-body text-body-sm"          // 0.875rem

// Labels
className="text-label-lg"                   // 0.875rem
className="text-label-md"                   // 0.75rem
className="text-label-sm"                   // 0.625rem
```

### Whitespace

```tsx
// Card padding
className="p-6"              // 1.5rem (24px)

// List item separation
className="space-y-6"        // 1.5rem between items

// Section margins
className="mb-8"             // 2rem (32px)
```

---

## 🎨 Custom CSS Classes

### Glassmorphism
```css
.glass                    // backdrop-blur + semi-transparent
```

### Cognitive Hub (AI Gradient)
```css
.cognitive-hub           // Subtle primary → tertiary gradient
```

### AI Spark (Left Accent)
```css
.ai-spark                // 4px left border in tertiary color
```

### Button Hover
```css
.btn-secondary-hover     // Smooth hover transition
```

### Input Focus
```css
.input-focus-glow        // Primary ring on focus
```

---

## ✅ Accessibility

### Contrast Ratios
All color combinations meet **WCAG AA** standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Focus States
```css
focus:ring-2 focus:ring-primary focus:ring-offset-2
```

### Keyboard Navigation
All interactive elements are keyboard accessible:
- Tab navigation
- Enter/Space activation
- Escape to close modals

---

## 🚀 Best Practices

### Do ✅
- Use CSS variables for all colors
- Leverage tonal layering for depth
- Apply glassmorphism sparingly (AI elements only)
- Maintain generous whitespace
- Use semantic color names (primary, tertiary, etc.)

### Don't ❌
- Use hardcoded hex values
- Add borders for sectioning
- Use pure black (#000000)
- Apply heavy shadows
- Cram information - let it breathe

---

## 📱 Responsive Design

### Breakpoints
```tsx
// Tailwind defaults
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Sidebar
- Fixed width: `w-64` (256px)
- Always visible on desktop
- Consider mobile drawer for future

### Content Area
- Flexible: `flex-1 ml-64`
- Padding: `p-8` (32px)
- Max width considerations for readability

---

## 🔧 Tailwind Configuration

All theme colors are configured in `tailwind.config.ts`:

```ts
colors: {
  surface: 'var(--surface)',
  primary: 'var(--primary)',
  // ... all colors use CSS variables
}
```

This enables:
- Instant theme switching
- Consistent color usage
- Easy customization
- Performance optimization

---

**Last Updated**: April 7, 2026
**Version**: 1.0.0
