import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

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



  selectedFiles: { name: string; size: number; isUploading: boolean; progress: number; uploadSpeed: number; startTime: number }[] = []; // โครงสร้างไฟล์

  // เปิดหน้าต่างเลือกไฟล์
  triggerFileUpload(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '*/*';
    fileInput.onchange = (event: Event) => this.onFileSelected(event);
    fileInput.click();

  }

  // จัดการไฟล์ที่เลือก
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const files: FileList = input.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`File ${i + 1}:`);
        console.log('Name:', file.name);
        console.log('Size:', file.size, 'bytes');
        console.log('Type:', file.type);
        console.log('Last Modified:', new Date(file.lastModified));
        console.log('-----------------------');

        const newFile = {
          name: file.name,
          size: file.size,
          isUploading: true,
          progress: 0,
          uploadSpeed: 1024 * 1024, // 1 MB/s
          startTime: Date.now()
        };

        this.selectedFiles.push(newFile);

        // ฟังก์ชันจำลองการอัปโหลด
        this.simulateUpload(newFile);
      }
    } else {
      console.log('No files selected.');
      this.selectedFiles = [];
    }
  }

  // ฟังก์ชันจำลองการอัปโหลด
  simulateUpload(file: { name: string; size: number; isUploading: boolean; progress: number; uploadSpeed: number; startTime: number }): void {
    const updateProgress = () => {
      if (file.progress < 100) {
        const elapsedTime = (Date.now() - file.startTime) / 1000; // เวลาในวินาที
        const bytesUploaded = Math.min(file.size, file.uploadSpeed * elapsedTime); // คำนวณขนาดไฟล์ที่อัปโหลดได้
        file.progress = (bytesUploaded / file.size) * 100; // คำนวณเปอร์เซ็นต์การอัปโหลด

        // แสดงเวลาที่ใช้
        const timeLeft = Math.max((file.size - bytesUploaded) / file.uploadSpeed, 0);
        console.log(`Uploading ${file.name}: ${Math.round(file.progress)}% complete. Time remaining: ${Math.round(timeLeft)} seconds.`);

        requestAnimationFrame(updateProgress); // เรียกใช้ฟังก์ชันในรอบถัดไป
      } else {
        file.isUploading = false;
        console.log(`Upload of ${file.name} complete.`);
      }
    };

    updateProgress(); // เริ่มต้นการอัปเดต
  }

  // ลบไฟล์ที่เลือก
  removeFile(event: MouseEvent, index: number): void {
    event.stopPropagation(); // หยุดการแพร่กระจายของเหตุการณ์คลิก
    this.selectedFiles.splice(index, 1);
    console.log(`File at index ${index} removed.`);
  }


  // จัดการลากไฟล์เข้า (Drag Over)
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy'; // แสดงไอคอนคัดลอก
  }

  // จัดการไฟล์ที่ลากมาวาง (Drop)
  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const files: FileList = event.dataTransfer.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Dropped File ${i + 1}:`);
        console.log('Name:', file.name);
        console.log('Size:', file.size, 'bytes');
        console.log('Type:', file.type);
        console.log('Last Modified:', new Date(file.lastModified));
        console.log('-----------------------');

        const newFile = {
          name: file.name,
          size: file.size,
          isUploading: true,
          progress: 0,
          uploadSpeed: 1024 * 1024, // 1 MB/s
          startTime: Date.now()
        };

        this.selectedFiles.push(newFile);

        // ฟังก์ชันจำลองการอัปโหลด
        this.simulateUpload(newFile);
      }

      event.dataTransfer.clearData(); // ล้างข้อมูลหลังจากประมวลผลเสร็จ
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