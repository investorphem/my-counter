;; Counter contract for Clarinet 4
(define-constant ERR_NOT_OWNER u1000)

(define-data-var owner principal tx-sender)
(define-data-var counter uint u0)

(define-private (require-owner (caller principal))
  (if (is-eq caller (var-get owner))
      (ok true)
      (err ERR_NOT_OWNER)))

(define-public (increment)
  (let ((new-value (+ (var-get counter) u1)))
    (var-set counter new-value)
    (ok new-value)))

(define-public (decrement)
  (let ((current (var-get counter)))
    (if (< current u1)
        (err ERR_NOT_OWNER)
        (let ((new-value (- current u1)))
          (var-set counter new-value)
          (ok new-value)))))

(define-public (set-counter (new-value uint))
  (begin
    (try! (require-owner tx-sender))
    (var-set counter new-value)
    (ok new-value)))

(define-read-only (get-counter)
  (var-get counter))
