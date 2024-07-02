<!-- resources/views/checkout/cancel.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout Cancellation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .alert-danger {
            color: #721c24;
            background-color: #f8d7da;
            border-color: #f5c6cb;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 8px;
        }
        .alert-danger strong {
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="alert alert-danger">
            <strong>Payment Cancelled!</strong> Your payment has been cancelled.
        </div>
        <p>If you need further assistance or wish to try again, please contact me on the email: Waellhamwii@gmail.com.</p>
    </div>
</body>
</html>
