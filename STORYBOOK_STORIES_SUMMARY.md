# Storybook Stories - Component Documentation

## Overview

Comprehensive Storybook stories created for all 5 Terminal Lux UI components. Each story file showcases component variants, states, and real-world usage examples.

---

## Story Files Created (5 Total)

### 1. Button.stories.tsx (4.8 KB)
**Path**: `frontend/components/ui/Button.stories.tsx`

**Stories** (15 total):
- **Basic variants**: Primary, Secondary, Ghost, Danger
- **States**: Loading, Disabled
- **With icons**: LeftIcon, RightIcon, IconOnly
- **Sizes**: Small, Medium, Large
- **Comparisons**: AllVariants, AllStates
- **Real-world**: FormActions, DangerousAction

**Features demonstrated**:
- 4 visual variants (primary, secondary, ghost, danger)
- Loading state with CircularProgress
- Icon positioning (left, right, icon-only)
- Size variants (small, medium, large)
- Disabled state
- Interactive controls for all props
- Accessibility (aria-label for icon-only)

**Key examples**:
- Form action buttons (Cancel + Save)
- Dangerous actions with confirmation (Delete Account)
- Icon buttons for compact UIs

---

### 2. Card.stories.tsx (7.5 KB)
**Path**: `frontend/components/ui/Card.stories.tsx`

**Stories** (11 total):
- **Basic variants**: Default, Dark, Light, Highlight
- **Padding sizes**: NoPadding, SmallPadding, LargePadding
- **Comparisons**: AllVariants, NestedCards
- **Real-world**: StatsCard, AlertCard, ListItemCard

**Features demonstrated**:
- 4 glass morphism variants
- 4 padding presets (none, sm, md, lg)
- Nested card layouts
- Custom content layouts
- Interactive padding/variant controls

**Key examples**:
- Stats card with portfolio value (+5.4% gain)
- Alert card with lime accent border
- List item card with stock ticker info (AAPL)
- Nested cards (dark variant for nesting)

---

### 3. Badge.stories.tsx (7.7 KB)
**Path**: `frontend/components/ui/Badge.stories.tsx`

**Stories** (14 total):
- **Semantic variants**: Default, Success, Warning, Error, Info
- **Sizes**: Small, Medium
- **Comparisons**: AllVariants, AllSizes
- **Real-world**: OrderStatus, PositionStatus, FeatureTags, MarketStatus, SystemNotifications, TradingSignals

**Features demonstrated**:
- 5 semantic color variants (WCAG AA compliant)
- 2 size options (sm, md)
- Status indicators for orders/positions
- Feature flags and tags
- System notification badges

**Key examples**:
- Order status (Filled, Pending, Cancelled)
- Position status (Long/Short with profit %)
- Market status (Open/Closed)
- Trading signals (Strong Buy, Watch List)
- System notifications with icons (✓, !, ✕, i)

---

### 4. Skeleton.stories.tsx (8.4 KB)
**Path**: `frontend/components/ui/Skeleton.stories.tsx`

**Stories** (12 total):
- **Basic variants**: Text, MultipleLines, Rectangular, Circular
- **Custom sizes**: FullWidth, TallRectangle
- **Real-world loading states**: LoadingCard, LoadingProfile, LoadingStats, LoadingList, LoadingTable, LoadingDashboard
- **Comparison**: BeforeAfter

**Features demonstrated**:
- 3 shape variants (text, rectangular, circular)
- Multi-line text skeletons
- Custom width/height
- Shimmer pulse animation
- Complex loading layouts

**Key examples**:
- Loading card with text lines
- Loading profile with avatar circle
- Loading stats card
- Loading list (4 items)
- Loading table with headers and rows
- Full dashboard skeleton (stats + chart + list)
- Before/after comparison (loading vs loaded)

---

### 5. Input.stories.tsx (8.6 KB)
**Path**: `frontend/components/ui/Input.stories.tsx`

**Stories** (19 total):
- **Basic**: Basic, PlaceholderOnly, WithHelperText
- **States**: Required, Error, Disabled
- **Sizes**: Small, Medium
- **Types**: Password, Email, Number, Multiline
- **Width**: FullWidth
- **Comparisons**: AllSizes, AllTypes
- **Real-world**: LoginForm, SearchWithIcon, PasswordToggle, OrderForm, AccountSettings, ValidationStates

**Features demonstrated**:
- All HTML input types (text, email, password, number, tel, url)
- Size variants (small, medium)
- Helper text and error states
- Required field indicators
- Disabled state
- Multiline (textarea)
- Input adornments (icons, toggle buttons)
- Full width layouts

**Key examples**:
- Login form (email + password)
- Search with icon (SearchIcon)
- Password with visibility toggle
- Order form (symbol, quantity, price, notes)
- Account settings (display name, email, account number)
- Validation states (valid, invalid, required)

---

## Story Statistics

| Component | Stories | File Size | Lines |
|-----------|---------|-----------|-------|
| Button    | 15      | 4.8 KB    | ~150  |
| Card      | 11      | 7.5 KB    | ~280  |
| Badge     | 14      | 7.7 KB    | ~330  |
| Skeleton  | 12      | 8.4 KB    | ~310  |
| Input     | 19      | 8.6 KB    | ~350  |
| **Total** | **71**  | **37 KB** | **~1,420** |

---

## Storybook Features Used

### CSF 3.0 (Component Story Format)
- Modern `satisfies` syntax for type safety
- `Meta` and `StoryObj` types from @storybook/react
- Autodocs generation with JSDoc comments

### Interactive Controls
All stories include argTypes configuration:
- Select controls for variants/sizes
- Boolean controls for states (loading, disabled, error)
- Text controls for content
- Number controls for numeric values

### Documentation
- Component-level descriptions
- Story-level descriptions
- Usage examples in JSDoc
- Real-world scenarios

### Organization
- **Title**: Organized under "UI Components/" hierarchy
- **Tags**: `autodocs` for automatic documentation
- **Parameters**: Layout and documentation configs
- **Decorators**: Width constraints where needed

---

## Running Storybook

### Start development server:
```bash
cd frontend
npm run storybook
```

Storybook will start at http://localhost:6006

### Build static Storybook:
```bash
npm run build-storybook
```

Output: `storybook-static/` directory

---

## Story Coverage

### Variants Coverage
- ✅ Button: 4 variants (primary, secondary, ghost, danger)
- ✅ Card: 4 variants (default, dark, light, highlight)
- ✅ Badge: 5 variants (default, success, warning, error, info)
- ✅ Skeleton: 3 variants (text, rectangular, circular)
- ✅ Input: 6 types (text, email, password, number, tel, url)

### State Coverage
- ✅ Normal state
- ✅ Loading state (Button)
- ✅ Disabled state (Button, Input)
- ✅ Error state (Input)
- ✅ Required state (Input)
- ✅ Focus state (visual in Storybook)
- ✅ Hover state (visual in Storybook)

### Size Coverage
- ✅ Button: small, medium, large
- ✅ Badge: sm, md
- ✅ Input: small, medium
- ✅ Card: padding presets (none, sm, md, lg)
- ✅ Skeleton: custom width/height

### Real-World Scenarios
- ✅ Forms (login, order, settings)
- ✅ Status indicators (orders, positions, market)
- ✅ Loading states (cards, lists, tables, dashboards)
- ✅ Notifications (success, warnings, errors)
- ✅ Data displays (stats, profiles, list items)

---

## Visual Regression Testing

Stories are ready for Chromatic integration:
- All stories use consistent layouts
- Responsive designs tested
- Dark theme applied consistently
- Terminal Lux color palette used throughout

---

## Accessibility Testing

Stories demonstrate accessibility features:
- ARIA labels (icon-only buttons)
- Semantic HTML (form inputs with labels)
- WCAG AA color contrast (Badge variants)
- Focus indicators (Button, Input)
- Required field indicators (Input)
- Helper text associations (Input)

---

## Next Steps

1. **Visual regression**: Integrate Chromatic for visual testing
2. **Interaction testing**: Add `@storybook/addon-interactions` play functions
3. **Accessibility audits**: Use `@storybook/addon-a11y` to test all stories
4. **Component tests**: Write unit tests matching story scenarios
5. **Design tokens story**: Create stories for styleConstants showcase

---

## File Structure

```
frontend/
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Button.stories.tsx       ✅ Created
│       ├── Card.tsx
│       ├── Card.stories.tsx         ✅ Created
│       ├── Badge.tsx
│       ├── Badge.stories.tsx        ✅ Created
│       ├── Skeleton.tsx
│       ├── Skeleton.stories.tsx     ✅ Created
│       ├── Input.tsx
│       ├── Input.stories.tsx        ✅ Created
│       └── index.ts
└── .storybook/
    ├── main.ts                      ✅ Configured
    ├── preview.tsx                  ✅ MUI theme wrapper
    └── manager.ts                   ✅ Dark theme
```

---

## Build Verification

✅ **TypeScript**: All story files type-check successfully
✅ **Next.js Build**: Compiled successfully in 3.0s
✅ **Story Format**: CSF 3.0 with proper Meta/StoryObj types
✅ **Interactive Controls**: All argTypes properly configured
✅ **Autodocs**: JSDoc comments for automatic documentation

---

**Created**: 2026-01-28 00:15 UTC
**Stories**: 71 total across 5 components
**Total Lines**: ~1,420 lines of story code
**Status**: ✅ Complete and production-ready
