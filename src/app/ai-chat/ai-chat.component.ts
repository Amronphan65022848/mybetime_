import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent {
recognition: any;
  languages: string[] = ['th-TH', 'en-US']; // รายการภาษาที่รองรับ
  currentLangIndex: number = 0; // ใช้ index ในการวนภาษาที่จะลอง
  accumulatedText: string = ''; // เก็บข้อความที่พูดไว้ก่อนหน้า
  userMessage: string = ''; // ข้อความของผู้ใช้งาน
  isChatVisible: boolean = false; // ซ่อน `chat` โดยเริ่มต้น
  chatMessages: { user: string; message: string }[] = []; // เปลี่ยนประเภทเป็นอาร์เรย์ของอ็อบเจ็กต์
 
  isLogoVisible: boolean = true;
  _text : string="";


  constructor(private _chat: ChatService) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.setupRecognition();
    } else {
      alert('Speech Recognition is not supported in this browser.');
    }
  }



  ngOnInit(): void {
    const item = { "text": "kkkk" }; // ตัวอย่างข้อความเริ่มต้น
    this._chat.createItem(item).subscribe(
      (data) => {
        console.log(data);
        if (data && data.results) {
          this._text = data.results; // อัปเดตข้อความที่ตอบกลับ
        }
      },
      (error) => {
        console.error('Error fetching response:', error);
      }
    );
  }
  

  submitMessage(): void {
    const textarea = document.getElementById('chatInput') as HTMLTextAreaElement;
    if (textarea) {
      const newMessage = textarea.value.trim(); // รับข้อความจาก textarea
  
      if (newMessage) {
        this.isChatVisible = true; // แสดง `chat` เมื่อมีข้อความ
        this.chatMessages.push({ user: 'You', message: newMessage }); // เพิ่มข้อความในอาร์เรย์
        textarea.value = ''; // ล้างข้อความใน textarea
        this.isLogoVisible = false; // ซ่อนภาพ logo เมื่อมีการกด submit
  
        // ส่งข้อความไปยัง API และรับผลลัพธ์
        const requestPayload = { text: newMessage };
        this._chat.createItem(requestPayload).subscribe(
          (data) => {
            if (data && data.results) {
              this.chatMessages.push({ user: 'Ai', message: data.results }); // แสดงข้อความตอบกลับ AI
            }
          },
          (error) => {
            console.error('Error from API:', error);
          }
        );
      }
    }
  }


  setupRecognition() {
    this.recognition.lang = this.languages[this.currentLangIndex]; // กำหนดภาษาเริ่มต้น
    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = this.handleError.bind(this);
    this.recognition.onend = () => {
      console.log('Speech recognition ended.');
    };
  }

  // ฟังก์ชันเริ่มการฟัง
  convertSpeechToText() {
    const textarea = document.getElementById('chatInput') as HTMLTextAreaElement;
  
    // ซิงโครไนซ์ข้อความใน textarea กับ accumulatedText
    if (textarea) {
      this.accumulatedText = textarea.value.trim(); // อัปเดต accumulatedText ด้วยข้อความปัจจุบัน
    }
  
    console.log(`กำลังฟังด้วยภาษา: ${this.languages[this.currentLangIndex]}`);
    this.recognition.start();
  
    const btn = document.getElementById('speechToTextBtn'); // อ้างอิงถึงปุ่ม
    if (btn) {
      btn.classList.add('listening');
  
      // ตัวอย่าง: เพิ่มเอฟเฟกต์การฟัง (3 วินาที)
      setTimeout(() => {
        btn.classList.remove('listening');
      }, 8700); // ระยะเวลาของเอฟเฟกต์
    }
  }
  

  // ฟังก์ชันจัดการเมื่อได้ข้อความ
  handleResult(event: any) {
    const spokenText = event.results[0][0].transcript; // ข้อความใหม่ที่ได้จากการพูด
    this.accumulatedText += (this.accumulatedText ? ' ' : '') + spokenText; // แนบข้อความใหม่
  
    const textarea = document.getElementById('chatInput') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = this.accumulatedText; // แสดงข้อความสะสมใน textarea
    }
  
    console.log('ข้อความสะสม:', this.accumulatedText); // ดูข้อความสะสมใน console
  }
  

  // ฟังก์ชันจัดการเมื่อเกิด error
  handleError(event: any) {
    console.warn(`Error occurred with language ${this.languages[this.currentLangIndex]}:`, event.error);

    // สลับภาษาไปลองภาษาถัดไป
    this.currentLangIndex = (this.currentLangIndex + 1) % this.languages.length;
    console.log(`Switching to language: ${this.languages[this.currentLangIndex]}`);
    this.convertSpeechToText(); // เรียกใหม่อีกครั้ง
  }
}
