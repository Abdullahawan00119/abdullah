# CV Upload and Download Fix - TODO

## Task: Fix the CV upload and download function

### Plan:
- [x] 1. Fix uploadToCloudinary in portfolioService.ts - Ensure PDFs are uploaded with correct resource_type settings
- [x] 2. Fix handleDownloadCV in Hero.tsx - Add better CORS error handling and fallback to direct download approach
- [x] 3. Fix TypeScript errors by adding vite-env.d.ts type definitions
- [x] 4. Verify the changes work correctly

### Changes Made:
1. **Hero.tsx** - CV Download:
   - Replaced CORS-prone fetch approach with Cloudinary's `fl_attachment` transformation for forced downloads
   - Added fallback for non-Cloudinary URLs
   - Opens download in new tab to avoid CORS issues

2. **portfolioService.ts** - CV Upload:
   - Improved PDF upload handling with `resource_type=auto` 
   - Added retry logic with `resource_type=raw` for PDFs if initial upload fails
   - Added better error messages and logging

3. **vite-env.d.ts** - Type Definitions:
   - Added proper TypeScript interfaces for import.meta.env
   - Fixed Cloudinary environment variable definitions
