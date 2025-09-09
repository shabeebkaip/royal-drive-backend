// Clean starter pack - no user-specific services
// Create your own services here when needed

export class ExampleService {
  // Example service methods - replace with your own business logic

  static async processExample(data: any): Promise<any> {
    // Your business logic here
    return {
      success: true,
      message: 'Example processed successfully',
      data: data,
      timestamp: new Date().toISOString()
    };
  }

  static async validateExample(data: any): Promise<boolean> {
    // Your validation logic here
    return true;
  }
}
