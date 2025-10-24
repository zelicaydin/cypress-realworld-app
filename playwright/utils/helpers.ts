import { APIRequestContext, Page } from "@playwright/test";
import { API_URL } from "./constants";
import { UserInfo } from "../models/user-info";
export async function seedDatabase(request: APIRequestContext) {
    try {
      const response = await request.post(`${API_URL}/testData/seed`);
      if (!response.ok()) {
        throw new Error(`Failed to seed database: ${response.status()} ${response.statusText()}`);
      }
      // The seed endpoint returns plain text "OK", not JSON
      return await response.text();
    } catch (error) {
      console.error('Failed to seed database:', error);
      throw error;
    }
}

export async function findUser(request: APIRequestContext): Promise<UserInfo> {
    try {
      const response = await request.get(`${API_URL}/testData/users`);
      if (!response.ok()) {
        throw new Error(`Failed to get users: ${response.status()} ${response.statusText()}`);
      }
      const data = await response.json();
      const userInfo = new UserInfo(data.results[0].firstName, data.results[0].lastName, data.results[0].username, data.results[0].password);
      return userInfo;
    } catch (error) {
      console.error('Failed to find user:', error);
      throw error;
    }
  }
export function isMobile(page: Page): boolean {
    const viewport = page.viewportSize();
    return viewport ? viewport.width < 414 : false;
  }