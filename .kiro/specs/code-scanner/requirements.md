# Requirements Document

## Introduction

本文档定义了一个通用的扫码组件（CodeScanner），用于 React Native 应用中扫描二维码和条形码。该组件基于 `react-native-camera-kit` 实现，提供扫码缓存、重复扫码提示、扫码时间间隔控制等高级功能，以提升用户体验和扫码效率。

## Glossary

- **CodeScanner**: 扫码组件，负责调用摄像头扫描二维码和条形码
- **ScanResult**: 扫码结果对象，包含扫描到的码值、码类型和扫描时间
- **ScanCache**: 扫码缓存，用于存储已扫描的码值以检测重复扫码
- **ScanInterval**: 扫码时间间隔，两次有效扫码之间的最小时间间隔
- **DuplicateScanCallback**: 重复扫码回调函数，当检测到重复扫码时触发

## Requirements

### Requirement 1

**User Story:** As a user, I want to scan QR codes and barcodes using my device camera, so that I can quickly capture code information.

#### Acceptance Criteria

1. WHEN the CodeScanner component mounts THEN the CodeScanner SHALL request camera permission and display the camera preview
2. WHEN a QR code or barcode enters the camera view THEN the CodeScanner SHALL decode the code and return a ScanResult containing the code value and code type
3. WHEN camera permission is denied THEN the CodeScanner SHALL display a permission denied message and provide a callback to handle the denial
4. WHEN the CodeScanner component unmounts THEN the CodeScanner SHALL release camera resources properly

### Requirement 2

**User Story:** As a user, I want the scanner to prevent rapid repeated scans, so that I don't accidentally process the same code multiple times.

#### Acceptance Criteria

1. WHEN a code is scanned successfully THEN the CodeScanner SHALL enforce a configurable minimum time interval before accepting the next scan
2. WHEN the ScanInterval is set to a positive value THEN the CodeScanner SHALL ignore any scan attempts within that interval after a successful scan
3. WHEN the ScanInterval is set to zero THEN the CodeScanner SHALL accept scans without any time-based throttling

### Requirement 3

**User Story:** As a user, I want to be notified when I scan the same code repeatedly, so that I can avoid duplicate processing.

#### Acceptance Criteria

1. WHEN a code is scanned THEN the CodeScanner SHALL check the ScanCache to determine if the code has been scanned before
2. WHEN a duplicate code is detected THEN the CodeScanner SHALL invoke the DuplicateScanCallback with the duplicate ScanResult
3. WHEN a duplicate code is detected THEN the CodeScanner SHALL provide a configurable option to either accept or reject the duplicate scan
4. WHEN the ScanCache reaches its maximum size THEN the CodeScanner SHALL remove the oldest entries using a FIFO strategy

### Requirement 4

**User Story:** As a developer, I want to configure the scan cache behavior, so that I can customize duplicate detection for different use cases.

#### Acceptance Criteria

1. WHEN initializing the CodeScanner THEN the CodeScanner SHALL accept a configurable cache size parameter with a default value
2. WHEN initializing the CodeScanner THEN the CodeScanner SHALL accept a configurable cache expiration time parameter
3. WHEN a cached entry exceeds its expiration time THEN the CodeScanner SHALL treat subsequent scans of that code as new scans
4. WHEN the clearCache function is called THEN the CodeScanner SHALL remove all entries from the ScanCache

### Requirement 5

**User Story:** As a developer, I want to control the scanner's visual appearance and behavior, so that I can integrate it seamlessly into my application.

#### Acceptance Criteria

1. WHEN initializing the CodeScanner THEN the CodeScanner SHALL accept style props for customizing the camera preview dimensions and appearance
2. WHEN initializing the CodeScanner THEN the CodeScanner SHALL accept a torch mode prop to control the flashlight state
3. WHEN initializing the CodeScanner THEN the CodeScanner SHALL accept a scan area frame prop to display a visual scanning guide
4. WHEN the scanner is paused THEN the CodeScanner SHALL stop processing scans while maintaining the camera preview

### Requirement 6

**User Story:** As a developer, I want to serialize and deserialize scan results, so that I can persist and restore scan history.

#### Acceptance Criteria

1. WHEN a ScanResult is serialized to JSON THEN the CodeScanner SHALL produce a valid JSON string containing all ScanResult properties
2. WHEN a valid JSON string is deserialized THEN the CodeScanner SHALL produce an equivalent ScanResult object
3. WHEN an invalid JSON string is deserialized THEN the CodeScanner SHALL return an error result indicating the parsing failure
