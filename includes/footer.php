<?php
$basePath = $basePath ?? ((strpos($_SERVER['SCRIPT_NAME'] ?? '', '/admin/') !== false) ? '../' : '');
?>
</main>
<footer class="footer mt-auto py-3 bg-light text-center">
    <div class="container">
        <span class="text-muted">&copy; <?= date('Y') ?> Online Quiz Platform</span>
    </div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= $basePath ?>assets/js/main.js"></script>
</body>
</html>
