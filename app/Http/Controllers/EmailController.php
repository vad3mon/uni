<?php

namespace App\Http\Controllers;

use App\Services\ImapService;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    protected $imapService;

    public function __construct(ImapService $imapService)
    {
        $this->imapService = $imapService;
    }

    public function saveDraft(Request $request)
    {
        $hostname = '{imap.mail.ru:993/imap/ssl}INBOX';
        $username = env('IMAP_USERNAME');
        $password = env('IMAP_PASSWORD');
//        $draft_folder = "{imap.mail.ru:993/imap/ssl}&BCEEPwQwBDw-"; // спам
//        $draft_folder = "{imap.mail.ru:993/imap/ssl}&BBIEHgQhBCEEIgQQBB0EHgQSBBsEFQQdBBgEFQ-"; // восстановление
//        $draft_folder = "{imap.mail.ru:993/imap/ssl}&BB4EQgQ,BEAEMAQyBDsENQQ9BD0ESwQ1-"; //отправленные
        $draft_folder = "{imap.mail.ru:993/imap/ssl}&BCcENQRABD0EPgQyBDgEOgQ4-"; // черновики

        // Подключение к почтовому серверу
        $inbox = imap_open($hostname, $username, $password) or die('Cannot connect to Gmail: ' . imap_last_error());

        $folders = imap_list($inbox, $hostname, '*');

        // Получение данных из запроса
        $to = $request->input('to');
        $subject = $request->input('subject');
        $message = $request->input('message');
        $htmlTable = base64_encode($request->input('htmlTable'));

        $message .= $htmlTable;

        // Создание заголовков письма
        $headers = "From: " . $username . "\r\n";
        $headers .= "To: " . $to . "\r\n";
        $headers .= "Subject: " . $subject . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: base64\r\n";

        // Сохранение черновика
        imap_append($inbox, $draft_folder, $headers . "\r\n\r\n" . $message);

        // Закрытие соединения
        imap_close($inbox);

        return response()->json(['message' => 'Draft saved successfully!', 'a' => $folders]);
    }



//        $request->validate([
//            'to' => 'required|email',
//            'subject' => 'required|string|max:255',
//            'body' => 'required|string',
//        ]);




//        $this->imapService->saveDraft($request->input('to'), $request->input('subject'), $request->input('body'));

//        return redirect()->back()->with('success', 'Черновик сохранен!');


    public function sendDraft($draftId)
    {
        $this->imapService->sendDraft($draftId);

        return redirect()->back()->with('success', 'Письмо отправлено!');
    }
}
