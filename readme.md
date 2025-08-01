This is a NodeJS project with express, mongoose, typescript.

# Getting Started

First, To run the project locally, create a .env file in the root directory of your project and add the following environment variables:

```env
# 🌐 Server Config
PORT=4000
APP_NAME=Parcel delivery System

# 🌍 Client App
CLIENT_URL=http://localhost:3000

# 🔐 Bcrypt
SALT_ROUNDS=13

# 🛢️ Database
DB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/parcel-delivery-system?retryWrites=true&w=majority&appName=<your-app>
NODE_ENV=development

# 🔑 JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=7d
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=30d
JWT_RESET_PASSWORD_TOKEN_SECRET=your_reset_password_token_secret
JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN=10m

# 🧩 Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

# 🗝️ Express Session
EXPRESS_SESSION_SECRET=your_express_session_secret

# 📧 SMTP Configuration
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_FROM=your_email@example.com
SMTP_PASSWORD=your_email_app_password

# 🧠 Redis
REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host_url
REDIS_PORT=your_redis_port
```

🚀 Running the Project in Development Mode

📦 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

▶️ 3. Start the Server
Make sure your .env is properly set up, then run:

```bash
npm dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This typically runs your server with nodemon (or ts-node if using TypeScript) so it reloads automatically on code changes.

✅ Confirm your .env is setup before starting the server.

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

# User modules

## Create user

create a new user to perform any operation. 2 methods now allowed to register. Google and credentials.

#### Endpoint

---

### POST: /api/v1/user/

---

### Request Body (JSON)

The API expects a **flat JSON object** with the following fields:

| Field    | Type                          | Required | Description                                                                          |
| -------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------ |
| name     | `string`                      | Yes      | user name                                                                            |
| email    | `string`                      | Yes      | user email                                                                           |
| password | `string`                      | Yes      | Must include A uppercase a lowercase a number and a special Charecter. Ex: Boss123#$ |
| phone    | Start with `+8801 ` or `"01"` | No       | user phone number                                                                    |
| adress   | `string`                      | No       | user adress                                                                          |

## Example Response

### Success: (201)

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully.",
  "data": {
    "name": "test2",
    "email": "test2@test.com",
    "phone": "+8801787286529",
    "password": "$2b$13$So9IbEiD4beputAtWiHr5OHSEaDAVCi.yG37Rhh39GcEUzVvYZ5E6",
    "role": "RECEIVER",
    "isBlocked": false,
    "isVerified": false,
    "isDeleted": false,
    "auths": [
      {
        "provider": "CREDENTIALS",
        "providerId": "test2@test.com",
        "_id": "688c87c6026ca49a2db7c402"
      }
    ],
    "orders": [],
    "_id": "688c87c6026ca49a2db7c401",
    "createdAt": "2025-08-01T09:24:22.636Z",
    "updatedAt": "2025-08-01T09:24:22.636Z"
  }
}
```

## Update user

---

user can update user name, phone, role (SENDER <--> RECEIVER), adress

#### Endpoint

---

### PUT: /api/v1/user/[userId]

---

### Request Body (JSON)

The API expects a **flat JSON object** with the following fields: (at-leat one field should provide)

| Field    | Type                          | Required | Description                                                                          |
| -------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------ |
| name     | `string`                      | Optional | user name                                                                            |
| password | `string`                      | Optional | Must include A uppercase a lowercase a number and a special Charecter. Ex: Boss123#$ |
| phone    | Start with `+8801 ` or `"01"` | Optional | user phone number                                                                    |
| adress   | `string`                      | Optional | user adress                                                                          |
| role     | `SENDER` or `RECEIVER`        | Optional | user role                                                                            |

## Example Response

### Success: (200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully.",
  "data": {
    "_id": "6888c4b9b66b9f0e0a97f7c9",
    "name": "Test account 2",
    "email": "test@test.com",
    "phone": "+8801787286529",
    "password": "$2b$10$IYBZ6B.bQvnnWhmrkHbv3uXYhO14gbFhS16/Nj5tb5YWOvX8uIO6W",
    "role": "SENDER",
    "isBlocked": false,
    "isVerified": true,
    "isDeleted": false,
    "auths": [
      {
        "provider": "CREDENTIALS",
        "providerId": "test@test.com",
        "_id": "6888c4b9b66b9f0e0a97f7ca"
      }
    ],
    "orders": [],
    "createdAt": "2025-07-29T12:55:21.653Z",
    "updatedAt": "2025-08-01T09:26:38.481Z"
  }
}
```

## Get Single User Info

Only admin get a single user all information.

#### Endpoint

---

### GET: /api/v1/user/[userId]

---

userID must be a valid mongoose Id.

## Example Response

### Success:(200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully.",
  "data": {
    "_id": "6888c4b9b66b9f0e0a97f7c9",
    "name": "Emdadul Hoque Emon",
    "email": "test@test.com",
    "phone": "+8801787286529",
    "role": "SENDER",
    "isBlocked": false,
    "isVerified": true,
    "isDeleted": false,
    "auths": [
      {
        "provider": "CREDENTIALS",
        "providerId": "test@test.com",
        "_id": "6888c4b9b66b9f0e0a97f7ca"
      }
    ],
    "orders": [],
    "createdAt": "2025-07-29T12:55:21.653Z",
    "updatedAt": "2025-07-31T10:35:13.230Z"
  }
}
```

## User Delete Api

Only loggedin user can delete himself or admin can delete.

---

#### Endpoint

---

### DELETE: /api/v1/user/[userId]

---

it will delete user and user cannot perform any kinds of operation in this app.

## Example Response

### Success (200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully.",
  "data": {
    "_id": "6888c4b9b66b9f0e0a97f7c9",
    "name": "Test account 2",
    "email": "test@test.com",
    "phone": "+8801787286529",
    "password": "$2b$10$IYBZ6B.bQvnnWhmrkHbv3uXYhO14gbFhS16/Nj5tb5YWOvX8uIO6W",
    "role": "SENDER",
    "isBlocked": false,
    "isVerified": true,
    "isDeleted": true,
    "auths": [
      {
        "provider": "CREDENTIALS",
        "providerId": "test@test.com",
        "_id": "6888c4b9b66b9f0e0a97f7ca"
      }
    ],
    "orders": [],
    "createdAt": "2025-07-29T12:55:21.653Z",
    "updatedAt": "2025-08-01T09:27:02.423Z"
  }
}
```

## Send OTP

send 6 digit otp to user's email to verify user account.

#### Endpoint

---

### POST: /api/v1/otp/send

---

### Request Body(JSON)

---

| Field | Type     | Required | Description            |
| ----- | -------- | -------- | ---------------------- |
| email | `string` | Yes      | user email to send otp |

---

## Example Response

### Success:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP sent successfully.",
  "data": null
}
```

## Verify OTP

send 6 digit otp to user's email to verify user account.

#### Endpoint

---

### POST: /api/v1/otp/verify

---

### Request Body(JSON)

---

| Field | Type     | Required | Description            |
| ----- | -------- | -------- | ---------------------- |
| email | `string` | Yes      | user email to send otp |
| otp   | `string` | Yes      | sent otp               |

---

## Example Response

### Success:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified successfully.",
  "data": null
}
```

# Auth Module

## Login

user must create an account to login.
user can login with credentials and google(if created with).

### Request Body(JSON):

| Field      | Type     | Required | Description   | Example         |
| ---------- | -------- | -------- | ------------- | --------------- |
| `email`    | `string` | Yes      | user email    | `test@test.com` |
| `password` | `string` | Yes      | user password | `Boss123#$`     |

## Example Response

### success

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg4ZGViNmVkZTIyOTU5MzI0MTc3MjYiLCJlbWFpbCI6ImVtZGFkdWwyNTgwQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1NDAzOTQ2MSwiZXhwIjoxNzU0NjQ0MjYxfQ.mh62ycYcrSHtbAU96wEMPAlSaQ6zlMfC0QIkYDimukc",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg4ZGViNmVkZTIyOTU5MzI0MTc3MjYiLCJlbWFpbCI6ImVtZGFkdWwyNTgwQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1NDAzOTQ2MSwiZXhwIjoxNzU2NjMxNDYxfQ.Iqse6fI64P_EF2iCHqUR7cxp0TDsDuHnWahpPnw85x8",
    "user": {
      "_id": "6888deb6ede2295932417726",
      "name": "Emdadul Hoque Emon 1074",
      "email": "emdadul2580@gmail.com",
      "picture": "https://lh3.googleusercontent.com/a/ACg8ocIIcsA6Wh8SMi0l6ULD8paQkyUPLeo6olouf_jO_iESGm2PqSXv=s96-c",
      "role": "ADMIN",
      "isBlocked": false,
      "isVerified": true,
      "isDeleted": false,
      "auths": [
        {
          "provider": "GOOGLE",
          "providerId": "109167906266727386223",
          "_id": "6888deb6ede2295932417727"
        },
        {
          "_id": "688c84a4be23fd3f96d6ecd6",
          "provider": "CREDENTIALS",
          "providerId": "emdadul2580@gmail.com"
        }
      ],
      "orders": [],
      "createdAt": "2025-07-29T14:46:14.664Z",
      "updatedAt": "2025-07-30T10:26:29.303Z",
      "password": "$2b$13$P0B16YlNtVfXeSQf.PuCbegE/hPKVvkidDT/B7PXWqiLFA7b4Nt3S"
    }
  }
}
```

## Logout

#### Endpoint

---

### GET: /api/v1/auth/logout

---

## Example Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged out successfully.",
  "data": null
}
```

# Parcel Module

## Parcel Creation API

Create a new parcel shipment with all required details including payment, package, and delivery info.

---

#### Endpoint

#### Authentication

- Requires authentication. With cookies
- Allowed roles: `SENDER`, `ADMIN`

---

### Request Body (JSON)

The API expects a **flat JSON object** with the following fields:

| Field                  | Type                        | Required                   | Description                                   |
| ---------------------- | --------------------------- | -------------------------- | --------------------------------------------- |
| sender                 | `string`                    | Yes                        | Sender user ID (Mongo ObjectId)               |
| receiver               | `string`                    | Yes                        | Receiver user ID (Mongo ObjectId)             |
| initiatedBy            | `string`                    | Yes                        | ID of the user initiating the parcel creation |
| paymentMethod          | `"COD"` or `"ONLINE"`       | Yes                        | Payment method                                |
| paymentStatus          | `"PAID"` or `"UNPAID"`      | Yes                        | Payment status                                |
| paymentAmount          | `number`                    | Yes                        | Total payment amount                          |
| weight                 | `number`                    | Yes                        | Package weight in kilograms                   |
| length                 | `number`                    | No                         | Package length (optional)                     |
| width                  | `number`                    | No                         | Package width (optional)                      |
| height                 | `number`                    | No                         | Package height (optional)                     |
| description            | `string`                    | No                         | Package description                           |
| pickupDate             | `string` (ISO date)         | Yes                        | Package pickup date                           |
| expectedDeliveryDate   | `string` (ISO date)         | Yes                        | Expected delivery date                        |
| deliveryType           | `"STANDARD"` or `"EXPRESS"` | No (default: `"STANDARD"`) | Delivery type                                 |
| pickupCity             | `string`                    | Yes                        | Pickup city                                   |
| pickupAddress          | `string`                    | Yes                        | Pickup full address                           |
| deliveryCity           | `string`                    | Yes                        | Delivery city                                 |
| deliveryAddress        | `string`                    | Yes                        | Delivery full address                         |
| deliveryPhone          | `string`                    | Yes                        | Receiver phone number                         |
| currentLocationAddress | `string`                    | No                         | Current package location address              |
| currentLocationLat     | `number`                    | No                         | Current package latitude                      |
| currentLocationLng     | `number`                    | No                         | Current package longitude                     |
| senderNote             | `string`                    | No                         | Optional note from sender                     |
| itemNames              | `string[]`                  | No                         | List of item names                            |
| itemQuantities         | `number[]`                  | No                         | Corresponding quantities for each item        |
| itemValues             | `number[]`                  | No                         | Corresponding values for each item            |
| images                 | `string[]`                  | No                         | Array of image URLs                           |

---

### Delivery Fee Calculation

The delivery fee is automatically calculated on the server based on:

- Weight
- Delivery type (`STANDARD` vs `EXPRESS`)
- Whether delivery is inter-city or intra-city (based on `pickupCity` and `deliveryCity`)

Clients **should not send** `deliveryFee` in the request.

---

## Example Response

### Success (201 Created)

```json
{
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "_id": "60c7f4d8a5b2f814c8fa54e7",
    "trackingId": "ABC123456",
    "paymentInfo": {
      "method": "COD",
      "status": "UNPAID",
      "amount": 250,
      "deleveryFee": 55
    },
    "sender": "60c7f4d8a5b2f814c8fa54e1",
    "receiver": "60c7f4d8a5b2f814c8fa54e2",
    "packageDetails": {
      "weight": 1.2,
      "dimensions": {
        "length": 10,
        "width": 8,
        "height": 5
      },
      "description": "Books",
      "items": [{ "name": "Book", "quantity": 2, "value": 100 }],
      "images": []
    },
    "deliveryInfo": {
      "pickupDate": "2025-08-01T00:00:00.000Z",
      "expectedDeliveryDate": "2025-08-03T00:00:00.000Z",
      "deliveryType": "STANDARD",
      "pickupAddress": {
        "city": "Dhaka",
        "address": "Uttara, Sector 4"
      },
      "deliveryAddress": {
        "city": "Chittagong",
        "address": "GEC Circle",
        "phone": "01712345678"
      },
      "currentLocation": {
        "type": "Point",
        "coordinates": [0, 0],
        "address": ""
      },
      "senderNote": ""
    },
    "status": "PENDING",
    "statusLogs": [],
    "isDeleted": false,
    "initiatedBy": "60c7f4d8a5b2f814c8fa54e1",
    "createdAt": "2025-07-31T10:00:00.000Z",
    "updatedAt": "2025-07-31T10:00:00.000Z"
  }
}
```

## Get All Parcel

---

only admin has access to this route

### Endpoint

`GET /api/parcels`

### Query Parameters

| Parameter | Type     | Required | Description                             | Example |
| --------- | -------- | -------- | --------------------------------------- | ------- |
| `page`    | `number` | No       | Page number for pagination              | `1`     |
| `limit`   | `number` | No       | Number of results per page              | `10`    |
| `search`  | `string` | No       | Search term to filter users by username | `john`  |
| `sort`    | `string` | No       | sort result                             | `true`  |

## Example Response

### Success (200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Parcels retrieved successfully.",
  "data": {
    "parcels": [
      {
        "paymentInfo": {
          "method": "COD",
          "status": "UNPAID",
          "amount": 250,
          "deleveryFee": 63
        },
        "packageDetails": {
          "dimensions": {
            "length": 10,
            "width": 10,
            "height": 5
          },
          "weight": 1.2,
          "description": "Books and documents",
          "items": [
            {
              "name": "Book",
              "quantity": 2,
              "value": 100,
              "_id": "688b620b8668b145ac97992a"
            },
            {
              "name": "Notebook",
              "quantity": 3,
              "value": 50,
              "_id": "688b620b8668b145ac97992b"
            }
          ],
          "images": []
        },
        "deliveryInfo": {
          "currentLocation": {
            "type": "Point",
            "coordinates": [0, 0],
            "address": ""
          },
          "pickupAddress": {
            "city": "Dhaka",
            "address": "Uttara, Sector 4"
          },
          "deliveryAddress": {
            "city": "Chittagong",
            "address": "GEC Circle",
            "phone": "01712345678"
          },
          "pickupDate": "2025-08-01T00:00:00.000Z",
          "expectedDeliveryDate": "2025-08-03T00:00:00.000Z",
          "deliveryType": "STANDARD"
        },
        "_id": "688b620b8668b145ac979929",
        "trackingId": "TRK-20250731-ZIF2SF",
        "sender": "6888c4b9b66b9f0e0a97f7c9",
        "receiver": "6888ddf300b939453748f629",
        "status": "CANCELED",
        "statusLogs": [
          {
            "status": "PENDING",
            "note": "Parcel created and waiting for approval",
            "updatedBy": "6888deb6ede2295932417726",
            "timestamp": "2025-07-31T12:31:07.677Z",
            "_id": "688b620b8668b145ac97992c"
          },
          {
            "status": "CANCELED",
            "updatedBy": "6888deb6ede2295932417726",
            "timestamp": "2025-07-31T12:31:25.705Z",
            "_id": "688b621d8668b145ac979932"
          },
          {
            "status": "BLOCKED",
            "updatedBy": "6888deb6ede2295932417726",
            "timestamp": "2025-07-31T12:44:43.807Z",
            "_id": "688b653bf8586c9cc5c4bd3a"
          }
        ],
        "isDeleted": false,
        "reviews": [],
        "initiatedBy": "6888deb6ede2295932417726",
        "deliveryAttempt": 0,
        "createdAt": "2025-07-31T12:31:07.690Z",
        "updatedAt": "2025-07-31T12:44:43.814Z"
      },
      ...
    ],
    "meta": {
      "total": 4,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

## Update Parcel Status API

Update the current status of a parcel along with optional status log details like location, note, and timestamp.

---

#### Endpoint

PATCH /api/parcel/update-status/:parcelId

- `:parcelId` — The MongoDB ObjectId of the parcel to update.

---

### Authentication

- Requires authentication.
- Allowed roles: `SENDER`, `ADMIN`, or others depending on your app's access control.

---

### Request Body (JSON)

| Field     | Type                                           | Required | Description                                                   |
| --------- | ---------------------------------------------- | -------- | ------------------------------------------------------------- |
| status    | One of the defined parcel statuses (see below) | Yes      | New status of the parcel                                      |
| location  | `string`                                       | No       | Current location of the parcel update                         |
| note      | `string`                                       | No       | Optional note related to the status update                    |
| timestamp | `string` (ISO date)                            | No       | Time of the status update; defaults to server time if omitted |

---

### Allowed Parcel Status Values

The `status` field must be one of the values defined in your `ParcelStatusEnum`, for example:

- `PENDING`
- `APPROVED`
- `PICK_UP_REQUESTED`
- `PICKED_UP`
- `IN_TRANSIT`
- `AT_HUB`
- `OUT_FOR_DELIVERY`
- `DELIVERY_ATTEMPTED`
- `DELIVERED`
- `CANCELED`
- `FAILED`
- `RETURNED_INITIATED`
- `RETURNED_IN_TRANSIT`
- `RETURNED`
- `ON_HOLD`

---

## Example Request Body

### success

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Parcel status updated successfully.",
  "data": {
    "paymentInfo": {
      "method": "COD",
      "status": "UNPAID",
      "amount": 250,
      "deleveryFee": 63
    },
    "packageDetails": {
      "dimensions": {
        "length": 10,
        "width": 10,
        "height": 5
      },
      "weight": 1.2,
      "description": "Books and documents",
      "items": [
        {
          "name": "Book",
          "quantity": 2,
          "value": 100,
          "_id": "688b9903c51b43283fa17b7e"
        },
        {
          "name": "Notebook",
          "quantity": 3,
          "value": 50,
          "_id": "688b9903c51b43283fa17b7f"
        }
      ],
      "images": []
    },
    "deliveryInfo": {
      "currentLocation": {
        "type": "Point",
        "coordinates": [0, 0],
        "address": ""
      },
      "pickupAddress": {
        "city": "Dhaka",
        "address": "Uttara, Sector 4"
      },
      "deliveryAddress": {
        "city": "Chittagong",
        "address": "GEC Circle",
        "phone": "01712345678"
      },
      "pickupDate": "2025-08-01T00:00:00.000Z",
      "expectedDeliveryDate": "2025-08-03T00:00:00.000Z",
      "deliveryType": "STANDARD"
    },
    "_id": "688b9903c51b43283fa17b7d",
    "trackingId": "TRK-20250731-2075JZ",
    "sender": "6888c4b9b66b9f0e0a97f7c9",
    "receiver": "6888ddf300b939453748f629",
    "status": "DELIVERED",
    "statusLogs": [
      {
        "status": "PENDING",
        "note": "Parcel created and waiting for approval",
        "updatedBy": "6888deb6ede2295932417726",
        "timestamp": "2025-07-31T16:25:39.278Z",
        "_id": "688b9903c51b43283fa17b80"
      },
      {
        "status": "APPROVED",
        "note": "a rider is assigned to pick up this parcel",
        "updatedBy": "6888deb6ede2295932417726",
        "timestamp": "2025-08-01T06:54:12.541Z",
        "_id": "688c6494a5ad1ea0e9564e1a"
      },
      {
        "status": "DELIVERED",
        "note": "Parcel is safely and successfully delivered to receiver.",
        "updatedBy": "6888deb6ede2295932417726",
        "timestamp": "2025-08-01T06:54:43.948Z",
        "_id": "688c64b3a5ad1ea0e9564e21"
      },
      {
        "status": "RETURNED_INITIATED",
        "note": "Wrong product ",
        "updatedBy": "6888deb6ede2295932417726",
        "timestamp": "2025-08-01T06:58:10.150Z",
        "_id": "688c6582ef48d37e42e6a12c"
      },
      {
        "status": "DELIVERED",
        "note": "Parcel is safely and successfully delivered to receiver.",
        "updatedBy": "6888deb6ede2295932417726",
        "timestamp": "2025-08-01T09:38:24.088Z",
        "_id": "688c8b10dbeaaee8664e9450"
      }
    ],
    "isDeleted": false,
    "reviews": [],
    "initiatedBy": "6888deb6ede2295932417726",
    "deliveryAttempt": 0,
    "createdAt": "2025-07-31T16:25:39.291Z",
    "updatedAt": "2025-08-01T09:38:24.095Z"
  }
}
```

# Stats Module

## Get Users Stat

only admin can access this route to get users stats.

---

#### Endpoint

### GET: /api/v1/stats/users

---

## Example Response

### success

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users stats retrieved successfully.",
  "data": {
    "activeUsers": 0,
    "last7daysUsers": 4,
    "last30daysUsers": 4,
    "usersByRole": {
      "SENDER": 1,
      "ADMIN": 1,
      "RECEIVER": 2
    },
    "blockedUsers": 0,
    "verifiedUsers": 3,
    "unverifiedUsers": 1
  }
}
```

## Get Parcels Stat

only admin can access this route to get parcels stats.

---

#### Endpoint

### GET: /api/v1/stats/parcels

---

## Example Response

### success

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Parcels stats retrieved successfully.",
  "data": {
    "allParcel": 4,
    "parcelByStatus": {
      "CANCELED": 2,
      "PENDING": 1,
      "RETURNED_INITIATED": 1
    },
    "parcelByPaymentMethod": {
      "COD": 4
    },
    "parcelByPaymentStatus": {
      "UNPAID": 4
    },
    "blockedParcels": 0,
    "deletedParcels": 0,
    "mostSender": {
      "count": 4,
      "_id": "6888c4b9b66b9f0e0a97f7c9",
      "name": "Test account 2",
      "email": "test@test.com",
      "phone": "+8801787286529"
    },
    "mostReceiver": {
      "count": 3,
      "_id": "6888ddf300b939453748f629",
      "name": "Bayjid Afride",
      "email": "emon0178728@gmail.com",
      "picture": "https://lh3.googleusercontent.com/a/ACg8ocIbwBZgHQZ6Mr-Qx53H3LvJBMwdENnIMNQE06-OV9txHnq52w=s96-c"
    }
  }
}
```
