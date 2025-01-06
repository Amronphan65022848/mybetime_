import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
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
  _text: string = "";


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


  getMessageClass(message: string): string {
    if (message.length <= 10) {
      return 'short'; // ข้อความสั้น
    } else if (message.includes('\n')) {
      return 'multiline'; // ข้อความที่ขึ้นบรรทัดใหม่
    } else {
      return 'long'; // ข้อความยาว
    }
  }
  getMessageClassAI(message: string): string {
    if (message.length <= 1) {
      return 'short'; // ข้อความสั้น
    } else if (message.includes('\n')) {
      return 'multiline'; // ข้อความที่ขึ้นบรรทัดใหม่
    } else {
      return 'long'; // ข้อความยาว
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
      }, 3000); // ระยะเวลาของเอฟเฟกต์
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







  downloadWord(): void {
    // สร้างเอกสารใหม่
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Hello, this is an example of a Word file created using Angular!',
                  bold: true,
                  size: 28
                }),
                new TextRun({
                  text: '\nThis is a second line of text.',
                  size: 24
                })
              ]
            })
          ]
        }
      ]
    });

    // สร้างไฟล์ Word จากเอกสาร
    Packer.toBlob(doc).then((blob) => {
      // สร้างลิงก์ดาวน์โหลดไฟล์
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'example.docx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }


  generateAndDownloadPDF() {
    let link = document.createElement("a")
    link.download = "na"
    link.href = "assets/2303.18223v15.pdf"
    link.click();
  }





  // ตัวอย่างข้อมูลสำหรับไฟล์ Excel
  data: any[] = [
    { Name: 'John', Age: 30, City: 'New York' },
    { Name: 'Jane', Age: 25, City: 'London' },
    { Name: 'Mike', Age: 35, City: 'Sydney' }
  ];

  // ฟังก์ชันสำหรับดาวน์โหลดไฟล์ Excel
  downloadExcel(): void {
    // แปลงข้อมูลเป็น worksheet
    const worksheet = XLSX.utils.json_to_sheet(this.data);

    // สร้าง workbook และเพิ่ม worksheet
    const workbook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };

    // สร้างไฟล์ Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // แปลงไฟล์เป็น Blob และสร้างลิงก์ดาวน์โหลด
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assets/Book1.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
