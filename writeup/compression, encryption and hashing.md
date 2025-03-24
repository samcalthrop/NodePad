## Compression

compression reduces...

* file size,
* download speed,
* data transfer speed, and,
* storage requirements

## Lossy Vs Lossless Data

### Lossy

When a compressed file is uncompressed/ decrypted (*for use*), some of the information stored about the file is lost

* A compromise on quality vs. size
* Not a significant loss of data

Colours are broken down/ simplified - the number of colours used is reduced

### Lossless

No information is lost when the file is uncompressed/ decrypted

* Ideal for vector-style images, as this method is most effective on images with large areas of continuous colour.
* Much less ideal for storing large full colour photos with few blocks of colour.

#### Dictionary Coding

| abc | def |
| --- | --- |
| 1   | 2   |

Data is stored in a dictionary for reference, *i.e*:

| reference | data |
| --------- | :--- |
| a         | v    |
|           |      |

Which is used as: `the quick brown ... = 1 2 3 ...`

#### Run Length Encoding (RLE)

Data is stored as `[number of contiguous pixels][colour]`, *i.e a row of 4 white \[W] pixels and then 6 blue \[B] could be stored as 4W 6B.*

### Encryption

*Encoding a message such that it can only be read by recipient and sender.*

Symmetric Encryption *- one key is used both to encrypt and decrypt the data.*

Asymmetric Encryption - *makes use of a public key to encrypt and a private key (held only by the recipient) to decrypt.*

\\-> Alternatively, hashing could be used as a one way encryption:

data --> hash function --> hash code: *original message is unattainable*