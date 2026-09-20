# Keep the submitted package identifiable

Before uploading a release, run `npm run release:check`. Keep the resulting ZIP together with `release-checks/package.json`, which records its version, file count, size, SHA-256 checksum, and verification time.

Copy both files into a versioned backup folder outside the repository before rebuilding. The next release check replaces the root ZIP; archive timestamps can change its checksum even when source files are unchanged.

Record the source commit with `git rev-parse HEAD` and the submission date alongside that backup. Only describe a checksum as the submitted package's checksum after comparing it with the file actually uploaded.

GitHub Pages deploys the website independently. A successful website deployment does not upload or publish the extension.
