# Profile Page Features

## Overview
A comprehensive profile page has been added to the Hostel Management System, allowing users to view and edit their personal information.

## Location
- **File**: `src/pages/Profile.jsx`
- **Route**: `/profile`
- **Access**: All authenticated users (Admin, Warden, Student)

## Features

### 1. Profile Display
- **Profile Picture**: Large circular avatar with gradient background
- **User Information**: Name, email, phone, role
- **Role-specific Badge**: Displays user role with color coding

### 2. Student-Specific Features
When logged in as a student, the profile shows:
- **Student ID**: Unique identifier
- **Room Information Card**:
  - Room number
  - Block name
  - Occupancy status (occupied/capacity)
- **Academic Information**:
  - Course name
  - Current year
  - Date of birth
  - Joining date
- **Address**: Full residential address
- **Guardian Information**:
  - Guardian name
  - Guardian phone number

### 3. Admin/Warden Features
For admin and warden roles:
- **Basic Information**:
  - Name
  - Email
  - Phone number
  - Role
- **Account Status**: Active/Inactive indicator
- **Member Since**: Account creation date

### 4. Edit Functionality
- **Edit Mode**: Click "Edit Profile" button to enable editing
- **Editable Fields**:
  - Name
  - Email
  - Phone
  - Address (students only)
  - Guardian name (students only)
  - Guardian phone (students only)
- **Save/Cancel**: Save changes or cancel to revert
- **Validation**: Form validation on save
- **Success Feedback**: Alert on successful update

### 5. UI/UX Features
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Card-based Layout**: Clean, organized information cards
- **Icons**: Lucide React icons for visual clarity
- **Color Coding**: Primary colors for important information
- **Loading State**: Shows spinner while fetching data
- **Error Handling**: Graceful error messages

## Navigation

### Access Profile Page:
1. **From Navbar**: Click profile dropdown → "My Profile"
2. **From Sidebar**: Click "Profile" link (students only)
3. **Direct URL**: Navigate to `/profile`

## Technical Details

### API Endpoints Used:
- `GET /api/students` - Fetch student profile
- `GET /api/auth/me` - Fetch user information
- `PUT /api/students/:id` - Update student profile
- `PUT /api/auth/update` - Update user information

### State Management:
- Uses React hooks (useState, useEffect)
- Auth context for user information
- Local state for form data and editing mode

### Components Used:
- Loading component for async operations
- Lucide React icons for visual elements
- Tailwind CSS for styling

## Layout Structure

```
Profile Page
├── Header (Title + Edit Button)
├── Left Column (1/3 width)
│   ├── Profile Card
│   │   ├── Avatar
│   │   ├── Name
│   │   ├── Role Badge
│   │   └── Student ID (if student)
│   └── Room Information Card (if student)
│       ├── Room Number
│       ├── Block Name
│       └── Occupancy
└── Right Column (2/3 width)
    ├── Personal Information Card
    │   ├── Name
    │   ├── Email
    │   ├── Phone
    │   ├── Role
    │   ├── Course (student)
    │   ├── Year (student)
    │   ├── Date of Birth (student)
    │   ├── Joining Date (student)
    │   └── Address (student)
    ├── Guardian Information Card (student only)
    │   ├── Guardian Name
    │   └── Guardian Phone
    └── Account Information Card
        ├── Account Status
        └── Member Since
```

## Styling

### Colors:
- Primary: Blue/Teal gradient for avatar
- Success: Green for active status
- Text: Gray scale for hierarchy
- Borders: Light gray for cards

### Spacing:
- Consistent padding and margins
- Grid layout for responsive design
- Card-based sections with shadows

## Future Enhancements

Potential additions:
- [ ] Profile picture upload
- [ ] Password change functionality
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Activity log
- [ ] Notification preferences
- [ ] Theme preferences (dark mode)
- [ ] Export profile data
- [ ] Social media links
- [ ] Emergency contact information

## Usage Example

### For Students:
1. Login as student
2. Click profile icon in navbar
3. Select "My Profile"
4. View all personal and academic information
5. Click "Edit Profile" to update information
6. Make changes and click "Save Changes"

### For Admin/Warden:
1. Login as admin or warden
2. Click profile icon in navbar
3. Select "My Profile"
4. View basic account information
5. Edit name, email, or phone if needed

## Security

- Protected route (requires authentication)
- Role-based data display
- API authorization checks
- Input validation on save
- Secure password handling (not displayed)

## Responsive Breakpoints

- **Mobile** (< 768px): Single column layout
- **Tablet** (768px - 1024px): Adjusted grid
- **Desktop** (> 1024px): Full 3-column layout

## Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Profile data is fetched on component mount
- Changes are saved to MongoDB via API
- Real-time updates after save
- Graceful fallbacks for missing data
- "N/A" displayed for empty fields
