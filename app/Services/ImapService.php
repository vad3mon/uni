<?php

namespace App\Services;

use PhpImap\Mailbox;

class ImapService
{
    protected $mailbox;

    public function __construct()
    {
        $this->mailbox = new Mailbox(
            '{' . env('IMAP_HOST') . ':993/imap/ssl}INBOX',
            env('IMAP_USERNAME'),
            env('IMAP_PASSWORD'),
        );
    }

    public function saveDraft($to, $subject, $body)
    {
        // Создание черновика
        $this->mailbox->createDraft($to, $subject, $body);
    }

    public function sendDraft($draftId)
    {
        // Отправка черновика
        $this->mailbox->sendDraft($draftId);
    }
}
