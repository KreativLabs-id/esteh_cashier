-- Add name column to users table
ALTER TABLE "users" ADD COLUMN "name" text NOT NULL DEFAULT 'User';

-- Update existing users with default names based on username
UPDATE "users" SET "name" = CASE 
    WHEN "username" = 'admin' THEN 'Administrator'
    WHEN "username" = 'kasir1' THEN 'Kasir 1'
    ELSE INITCAP("username")
END;
