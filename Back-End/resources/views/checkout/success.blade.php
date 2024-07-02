<!-- resources/views/checkout/success.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout Success</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .alert-success {
            color: #155724;
            background-color: #d4edda;
            border-color: #c3e6cb;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 8px;
            text-align: center;
        }
        .alert-success strong {
            color: #0f5132;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        ul li {
            background-color: #f1f1f1;
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 8px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        ul li strong {
            display: inline-block;
            width: 150px;
        }
        p {
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 0.9em;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="alert alert-success">
            <strong>Payment Successful!</strong>
        </div>
        <p>Your order details:</p>
        <ul>
            <li><strong>Order ID:</strong> {{ $sessionId }}</li>
            <li><strong>Total Amount:</strong> ${{ $amount_total }} {{ $currency }}</li>
            <li><strong>Customer Name:</strong> {{ $customer_name }}</li>
            <li><strong>Customer Email:</strong> {{ $customer_email }}</li>
            <li><strong>Payment Status:</strong> {{ ucfirst($payment_status) }}</li>
            <li><strong>Order Date:</strong> {{ $created_at }}</li>
        </ul>
        <p>For any questions or issues, please contact me on the email: Waellhamwii@gmail.com.</p>
        <div class="footer">
            &copy; {{ date('Y') }} Your Company. All rights reserved.
        </div>
    </div>
</body>
</html>
