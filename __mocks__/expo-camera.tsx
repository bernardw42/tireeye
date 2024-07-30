export const useCameraPermissions = jest.fn().mockReturnValue({
    permission: { granted: true }, // Adjust as per your test needs
    requestPermission: jest.fn().mockResolvedValue({ status: 'granted' }), // Adjust as per your test needs
  });
  