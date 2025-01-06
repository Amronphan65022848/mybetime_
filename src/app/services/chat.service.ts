import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://nina-chat.demotoday.net/retrievers'; // Replace with your API URL
  constructor(private http: HttpClient) {}

  // CREATE: Add a new item
  createItem(item: any): Observable<any> {
    return this.http.post(this.apiUrl, item);
  }

  // READ: Get all items
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // READ: Get a single item by ID
  getItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // UPDATE: Update an existing item
  updateItem(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }

  // DELETE: Remove an item
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
