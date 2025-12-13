;; Counter contract for Clarinet 4 with enhanced features
(define-constant ERR_NOT_OWNER     u1000)
(define-constant ERR_UNDERFLOW    u1001)
(define-constant ERR_PAUSED       u1002)

;; Store the owner (set on deployment)
(define-data-var owner principal tx-sender)

;; Store the counter value
(define-data-var counter uint u0)

;; Store pause state
(define-data-var paused bool false)

;; Store allowed principals (access control)
(define-data-var allowed-principals (map principal bool) {})

;; Helper: Only owner can call
(define-private (require-owner (caller principal))
  (if (is-eq caller (var-get owner))
      true
      (err ERR_NOT_OWNER)))

;; Helper: Only allowed principals can call
(define-private (require-allowed (caller principal))
  (let ((allowed? (map-get? allowed-principals caller)))
    (if allowed?
        true
        (err ERR_NOT_OWNER))))

;; Public: Toggle pause state (owner only)
(define-public (toggle-pause)
  (begin
    (require-owner tx-sender)
    (var-set paused (not (var-get paused)))
    (ok true)))

;; Public: Add allowed principal (owner only)
(define-public (add-allowed (principal principal))
  (begin
    (require-owner tx-sender)
    (map-set allowed-principals principal true)
    (ok true)))

;; Public: Remove allowed principal (owner only)
(define-public (remove-allowed (principal principal))
  (begin
    (require-owner tx-sender)
    (map-delete allowed-principals principal)
    (ok true)))

;; Public: Increment counter (allowed principals can call)
(define-public (increment)
  (begin
    (if (var-get paused)
        (err ERR_PAUSED)
        (let ((new-value (+ (var-get counter) u1)))
          (var-set counter new-value)
          (ok new-value)))))

;; Public: Decrement counter (allowed principals can call)
(define-public (decrement)
  (begin
    (if (var-get paused)
        (err ERR_PAUSED)
        (let ((current (var-get counter)))
          (if (is-less-than current u1)
              (err ERR_UNDERFLOW)
              (let ((new-value (- current u1)))
                (var-set counter new-value)
                (ok new-value))))))

;; Public: Set counter (owner only)
(define-public (set-counter (new-value uint))
  (begin
    (require-owner tx-sender)
    (var-set counter new-value)
    (ok new-value)))

;; Public: Transfer ownership (owner only)
(define-public (transfer-ownership (new-owner principal))
  (begin
    (require-owner tx-sender)
    (var-set owner new-owner)
    (ok true)))