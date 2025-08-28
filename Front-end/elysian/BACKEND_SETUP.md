# Backend Connection Setup

This project is now configured to connect with your backend API. Here's how to set it up:

## 1. Environment Configuration

Since we can't create `.env` files directly, you need to manually create one:

1. Create a `.env.local` file in the `elysian` directory
2. Add the following content:

```bash
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

**Replace `http://localhost:8000` with your actual backend URL and port.**

## 2. Backend Endpoints

The frontend is configured to use these endpoints:

- **Registration**: `POST /api/register/`
- **Login**: `POST /api/login/`
- **Logout**: `POST /api/logout/`
- **User Profile**: `GET /api/user/profile/`

## 3. API Data Structure

### Registration Request (`/api/register/`)
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string",
  "dateOfBirth": "string (YYYY-MM-DD)",
  "gender": "string",
  "role": "string (seeker|listener)"
}
```

### Login Request (`/api/login/`)
```json
{
  "email": "string",
  "password": "string"
}
```

## 4. Expected Response Format

Your backend should return responses in this format:

```json
{
  "success": true,
  "data": { /* user data or token */ },
  "message": "Success message"
}
```

For errors:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 5. Testing the Connection

1. Start your backend server
2. Update the `.env.local` file with your backend URL
3. Start the frontend: `npm run dev`
4. Navigate to `/signup` to test registration
5. Navigate to `/login` to test login

## 6. Troubleshooting

- **CORS Issues**: Ensure your backend allows requests from `http://localhost:3000`
- **Network Errors**: Check if your backend is running and accessible
- **API Errors**: Verify the endpoint URLs and data format match your backend

## 7. Files Modified

- `src/config/api.ts` - API configuration
- `src/utils/api.ts` - API utility functions
- `src/app/signup/page.tsx` - Connected signup form
- `src/app/login/page.tsx` - Connected login form
