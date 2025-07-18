# Dating App - Expo Router with Supabase Backend

A modern dating app built with React Native, Expo Router, and Supabase as the backend service.

## Features

- User authentication (email/password, social logins)
- Profile creation and editing
- Discovery with swipeable cards
- Matching system
- Messaging between matches
- Push notifications
- Camera integration for profile photos
- Localization support
- Persistent storage with AsyncStorage
- Smooth animations with React Native Reanimated

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Create the following tables in your Supabase database:

#### Tables Structure

**profiles**
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  birthdate date,
  age integer,
  gender text,
  looking_for text,
  bio text,
  interests text[],
  location text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." 
on profiles for select using (true);

create policy "Users can insert their own profile." 
on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile." 
on profiles for update using (auth.uid() = id);
```

**likes**
```sql
create table likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  liked_user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, liked_user_id)
);

-- Enable RLS
alter table likes enable row level security;

-- Create policies
create policy "Users can insert their own likes." 
on likes for insert with check (auth.uid() = user_id);

create policy "Users can view their own likes." 
on likes for select using (auth.uid() = user_id);
```

**passes**
```sql
create table passes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  passed_user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, passed_user_id)
);

-- Enable RLS
alter table passes enable row level security;

-- Create policies
create policy "Users can insert their own passes." 
on passes for insert with check (auth.uid() = user_id);

create policy "Users can view their own passes." 
on passes for select using (auth.uid() = user_id);
```

**matches**
```sql
create table matches (
  id uuid default uuid_generate_v4() primary key,
  user1_id uuid references profiles(id) on delete cascade not null,
  user2_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user1_id, user2_id)
);

-- Enable RLS
alter table matches enable row level security;

-- Create policies
create policy "Users can view their own matches." 
on matches for select using (auth.uid() = user1_id or auth.uid() = user2_id);
```

**messages**
```sql
create table messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now(),
  read_at timestamp with time zone
);

-- Enable RLS
alter table messages enable row level security;

-- Create policies
create policy "Users can insert messages they send." 
on messages for insert with check (auth.uid() = sender_id);

create policy "Users can view messages they sent or received." 
on messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
```

4. Create a Storage bucket named `avatars` in your Supabase project for profile images.

5. Create a `.env` file in the root directory with your Supabase credentials:

```
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Running the App

```bash
npx expo start
```

## Project Structure

```
/app
  /(auth)           # Authentication screens
    _layout.js      # Auth layout
    login.js        # Login screen
    signup.js       # Signup screen
    onboarding.js   # Profile setup
  /(tabs)           # Main app tabs
    _layout.js      # Tabs layout
    index.js        # Home/Discovery screen
    matches.js      # Matches screen
    messages.js     # Messages screen
    profile.js      # Profile screen
  /(modals)         # Modal screens
    camera.js       # Camera modal
    profile-view.js # Profile view modal
  /contexts         # React contexts
    AuthContext.js  # Authentication context
  /services         # API services
    profileService.js # Profile and matching services
  /utils            # Utility functions
    animations.js   # Animation utilities
    i18n.js         # Localization
    notifications.js # Push notifications
    storage.js      # AsyncStorage utilities
    supabase.js     # Supabase client
    theme.js        # App theme
  _layout.js        # Root layout
```

## Authentication Flow

1. User signs up or logs in
2. New users complete the onboarding process to set up their profile
3. Users are redirected to the main app after authentication
4. The app maintains the session state and automatically logs in returning users

## Development

### Adding New Features

- Create new screens in the appropriate directory
- Update navigation as needed
- Add new services for API interactions
- Extend the theme for consistent styling

### Environment Variables

The app uses `react-native-dotenv` to manage environment variables. Add any new variables to the `.env` file and update the babel config if needed.

## License

This project is licensed under the MIT License.
# datingapp-1
